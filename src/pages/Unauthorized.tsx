
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-institutional-blue via-primary to-institutional-blue p-6">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Accès Non Autorisé
          </CardTitle>
          <CardDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
          
          <Button 
            onClick={() => navigate(-1)}
            className="w-full gradient-institutional text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
