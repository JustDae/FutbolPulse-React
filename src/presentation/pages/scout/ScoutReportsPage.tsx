import { Card, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { FileText, Download, Plus } from 'lucide-react';

export function ScoutReportsPage() {
  const reports = [
    { id: 1, title: 'Análisis de Rendimiento - Endrick', date: '12 Jul 2026', author: 'Ojeador Principal' },
    { id: 2, title: 'Evaluación Técnica - Lamine Yamal', date: '05 Jul 2026', author: 'Ojeador Principal' },
    { id: 3, title: 'Reporte de Lesiones U-18', date: '28 Jun 2026', author: 'Cuerpo Médico' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes de Scouting</h1>
          <p className="text-muted-foreground mt-1">Consulta y genera reportes detallados sobre jugadores y torneos.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Reporte
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Publicado el {report.date} por {report.author}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
