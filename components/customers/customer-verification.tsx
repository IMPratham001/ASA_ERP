
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { customerAPI } from "@/lib/api/laravel";

export function CustomerVerification({ customer }) {
  const [loading, setLoading] = useState(false);

  const handleVerification = async (status: 'verified' | 'incomplete') => {
    setLoading(true);
    try {
      await customerAPI.update(customer.id, {
        detailsStatus: status,
        verifiedBy: "admin", // Replace with actual admin ID
        verifiedAt: new Date(),
        requiredFields: status === 'incomplete' ? 
          getMissingFields(customer) : null
      });
      
      toast({
        title: "Success",
        description: `Customer marked as ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getMissingFields = (customer) => {
    const required = ['email', 'phone', 'address'];
    return required.filter(field => !customer[field]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Customer Details Status
          <Badge variant={
            customer.detailsStatus === 'verified' ? 'success' :
            customer.detailsStatus === 'pending_details' ? 'warning' : 'destructive'
          }>
            {customer.detailsStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-x-2">
          <Button 
            onClick={() => handleVerification('verified')}
            disabled={loading}
            variant="outline"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Verified
          </Button>
          <Button
            onClick={() => handleVerification('incomplete')}
            disabled={loading}
            variant="outline"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Mark as Incomplete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
