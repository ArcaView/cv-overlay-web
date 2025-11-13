import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";

interface FileWithStatus {
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  error?: string;
}

const BulkParse = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        status: 'pending' as const
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulkParse = async () => {
    setProcessing(true);

    // Simulate bulk processing - replace with actual API calls
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      // Update status to processing
      setFiles(prev => prev.map((f, idx) =>
        idx === i ? { ...f, status: 'processing' as const } : f
      ));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Randomly succeed or fail for demo
      const success = Math.random() > 0.1;

      setFiles(prev => prev.map((f, idx) =>
        idx === i ? {
          ...f,
          status: success ? 'completed' as const : 'error' as const,
          result: success ? {
            id: `parse_${Math.random().toString(36).substr(2, 9)}`,
            name: files[i].file.name,
            candidate_name: `Candidate ${i + 1}`,
            skills_count: Math.floor(Math.random() * 15) + 5,
            experience_years: Math.floor(Math.random() * 10) + 1,
          } : undefined,
          error: success ? undefined : 'Failed to parse document'
        } : f
      ));
    }

    setProcessing(false);
  };

  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const pendingCount = files.filter(f => f.status === 'pending').length;

  const downloadResults = () => {
    const results = files
      .filter(f => f.status === 'completed')
      .map(f => f.result);

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-parse-results-${Date.now()}.json`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bulk Parse CVs</h1>
            <p className="text-muted-foreground">
              Upload multiple CVs and process them in batch
            </p>
          </div>
          {files.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={processing}
              >
                Clear All
              </Button>
              {completedCount > 0 && (
                <Button variant="outline" onClick={downloadResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Results
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {files.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Files</CardDescription>
                <CardTitle className="text-3xl">{files.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl text-success">{completedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl text-muted-foreground">{pendingCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Errors</CardDescription>
                <CardTitle className="text-3xl text-destructive">{errorCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CVs
              </CardTitle>
              <CardDescription>
                Select multiple CV files to parse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="bulk-upload"
                  accept=".pdf,.docx,.doc,.txt"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                  disabled={processing}
                />
                <label
                  htmlFor="bulk-upload"
                  className={`cursor-pointer flex flex-col items-center gap-3 ${processing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Upload multiple files</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOCX, DOC, or TXT
                    </p>
                  </div>
                </label>
              </div>

              <Button
                onClick={handleBulkParse}
                disabled={files.length === 0 || processing || pendingCount === 0}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing {completedCount}/{files.length}
                  </>
                ) : (
                  `Parse ${pendingCount} ${pendingCount === 1 ? 'File' : 'Files'}`
                )}
              </Button>

              {/* Usage Info */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Usage</span>
                  <span className="font-medium">156 / 1,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '15.6%' }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  844 parses remaining in your plan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Files Queue</CardTitle>
              <CardDescription>
                Track the status of each uploaded file
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No files uploaded yet</p>
                  <p className="text-sm mt-1">Upload CVs to start bulk processing</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {files.map((fileItem, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {fileItem.status === 'pending' && (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          )}
                          {fileItem.status === 'processing' && (
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          )}
                          {fileItem.status === 'completed' && (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          )}
                          {fileItem.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {fileItem.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(fileItem.file.size / 1024).toFixed(1)} KB
                            {fileItem.result && ` • ${fileItem.result.candidate_name}`}
                            {fileItem.error && ` • ${fileItem.error}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              fileItem.status === 'completed' ? 'default' :
                              fileItem.status === 'error' ? 'destructive' :
                              'secondary'
                            }
                            className={
                              fileItem.status === 'completed'
                                ? 'bg-success/10 text-success border-success/20'
                                : ''
                            }
                          >
                            {fileItem.status === 'pending' && 'Pending'}
                            {fileItem.status === 'processing' && 'Processing'}
                            {fileItem.status === 'completed' && 'Completed'}
                            {fileItem.status === 'error' && 'Error'}
                          </Badge>

                          {(fileItem.status === 'pending' || fileItem.status === 'error') && !processing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Bulk Processing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• <strong>Optimal batch size:</strong> 10-50 files for best performance</p>
            <p>• <strong>File naming:</strong> Use clear naming conventions for easy identification</p>
            <p>• <strong>Results:</strong> Download results as JSON for further processing</p>
            <p>• <strong>API limits:</strong> Bulk parsing counts toward your monthly quota</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BulkParse;
