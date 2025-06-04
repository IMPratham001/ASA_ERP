<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
        'role_id',
        'is_active',
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the company that owns the user.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the role that belongs to the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get orders created by this user.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get invoices created by this user.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get user permissions with role-based defaults
     */
    public function getPermissionsAttribute($value)
    {
        $userPermissions = $value ? json_decode($value, true) : [];
        $rolePermissions = $this->role ? $this->role->permissions : [];
        
        // Merge role permissions with user-specific permissions
        return array_merge($rolePermissions, $userPermissions);
    }

    /**
     * Get structured permissions for API response
     */
    public function getStructuredPermissions(): array
    {
        $permissions = $this->permissions ?? [];
        
        // Default permission structure
        $defaultStructure = [
            'canAccessDashboard' => false,
            'canAccessCustomers' => false,
            'canAccessProducts' => false,
            'canAccessReports' => false,
            'canAccessSettings' => false,
            'canAccessUsers' => false,
            'canAccessCompanies' => false,
            'modules' => [],
            'permissions' => [],
            'role' => $this->role?->name ?? 'user',
        ];

        // If permissions is a simple array of strings, convert to structured format
        if (is_array($permissions) && !empty($permissions)) {
            // Handle legacy format or simple string array
            if (is_string($permissions[0] ?? null)) {
                $structuredPermissions = $this->convertLegacyPermissions($permissions);
            } else {
                $structuredPermissions = $permissions;
            }
        } else {
            $structuredPermissions = [];
        }

        return array_merge($defaultStructure, $structuredPermissions);
    }

    /**
     * Convert legacy string array permissions to structured format
     */
    private function convertLegacyPermissions(array $permissions): array
    {
        $structured = [
            'canAccessDashboard' => in_array('dashboard', $permissions) || in_array('dashboard.view', $permissions),
            'canAccessCustomers' => in_array('customers', $permissions) || in_array('customers.view', $permissions),
            'canAccessProducts' => in_array('products', $permissions) || in_array('products.view', $permissions),
            'canAccessReports' => in_array('reports', $permissions) || in_array('reports.view', $permissions),
            'canAccessSettings' => in_array('settings', $permissions) || in_array('settings.view', $permissions),
            'canAccessUsers' => in_array('users', $permissions) || in_array('users.view', $permissions),
            'canAccessCompanies' => in_array('companies', $permissions) || in_array('companies.view', $permissions),
            'modules' => $this->extractModules($permissions),
            'permissions' => $permissions,
        ];

        return $structured;
    }

    /**
     * Extract accessible modules from permission strings
     */
    private function extractModules(array $permissions): array
    {
        $modules = [];
        $moduleMap = [
            'dashboard' => 'dashboard',
            'customers' => 'customers',
            'products' => 'products',
            'reports' => 'reports',
            'settings' => 'settings',
            'users' => 'users',
            'companies' => 'companies',
        ];

        foreach ($permissions as $permission) {
            $module = explode('.', $permission)[0];
            if (isset($moduleMap[$module]) && !in_array($moduleMap[$module], $modules)) {
                $modules[] = $moduleMap[$module];
            }
        }

        return $modules;
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        $permissions = $this->permissions ?? [];
        
        // Check exact match
        if (in_array($permission, $permissions)) {
            return true;
        }

        // Check wildcard permissions (e.g., 'customers.*' allows 'customers.view')
        foreach ($permissions as $userPermission) {
            if (str_ends_with($userPermission, '.*')) {
                $prefix = str_replace('.*', '', $userPermission);
                if (str_starts_with($permission, $prefix)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if user can access module
     */
    public function canAccessModule(string $module): bool
    {
        $structuredPermissions = $this->getStructuredPermissions();
        
        // Check direct module access
        if (in_array($module, $structuredPermissions['modules'])) {
            return true;
        }

        // Check specific boolean flags
        $moduleAccessMap = [
            'dashboard' => 'canAccessDashboard',
            'customers' => 'canAccessCustomers',
            'products' => 'canAccessProducts',
            'reports' => 'canAccessReports',
            'settings' => 'canAccessSettings',
            'users' => 'canAccessUsers',
            'companies' => 'canAccessCompanies',
        ];

        if (isset($moduleAccessMap[$module])) {
            return $structuredPermissions[$moduleAccessMap[$module]] ?? false;
        }

        return false;
    }
}