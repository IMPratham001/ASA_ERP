
import { NextResponse } from 'next/server';
import { verifyToken } from './utils';
import { hasPermission } from './permissions';

export async function authMiddleware(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const user = decoded.user;

    // Attach user to request for downstream use
    (req as any).user = user;

    // Check module-specific permissions
    const path = new URL(req.url).pathname;
    const module = path.split('/')[1]; // e.g., /inventory/... -> inventory

    const requiredPermission = req.method === 'GET' ? 'view' : 
                             req.method === 'POST' ? 'create' :
                             req.method === 'PUT' ? 'edit' :
                             req.method === 'DELETE' ? 'delete' : 'view';

    if (!hasPermission(user, module, requiredPermission)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
