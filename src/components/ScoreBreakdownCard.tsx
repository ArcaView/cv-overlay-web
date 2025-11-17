import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Briefcase, Certificate, TrendingUp, Code } from "lucide-react";
import { ScoreBreakdown } from "@/contexts/RolesContext";

interface ScoreBreakdownCardProps {
  scoreBreakdown?: ScoreBreakdown;
  totalScore?: number;
}

export const ScoreBreakdownCard = ({ scoreBreakdown, totalScore }: ScoreBreakdownCardProps) => {
  if (!scoreBreakdown) return null;

  const components = [
    {
      name: "Skills",
      score: scoreBreakdown.skills || 0,
      weight: 52.5,
      icon: Code,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      name: "Experience",
      score: scoreBreakdown.experience || 0,
      weight: 22.5,
      icon: Briefcase,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      name: "Prestige",
      score: scoreBreakdown.prestige || 0,
      weight: 7.5,
      icon: Award,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      isNew: true
    },
    {
      name: "Education",
      score: scoreBreakdown.education || 0,
      weight: 7.5,
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      name: "Certifications",
      score: scoreBreakdown.certifications || 0,
      weight: 5.0,
      icon: Certificate,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      name: "Stability",
      score: scoreBreakdown.stability || 0,
      weight: 5.0,
      icon: TrendingUp,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
        <CardDescription>
          Detailed analysis of scoring components (baseline-2.0)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalScore !== undefined && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Score</p>
              <p className="text-3xl font-bold text-primary">{totalScore}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Model: baseline-2.0</p>
              <p className="text-xs text-muted-foreground">Rules: v2.0.0</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {components.map((component) => {
            const Icon = component.icon;
            const contribution = (component.score * component.weight) / 100;

            return (
              <div key={component.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${component.bgColor}`}>
                      <Icon className={`w-4 h-4 ${component.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{component.name}</span>
                        {component.isNew && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Weight: {component.weight}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{component.score.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">
                      +{contribution.toFixed(1)} pts
                    </div>
                  </div>
                </div>
                <Progress value={component.score} className="h-2" />
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p className="font-medium mb-1">Scoring Model v2.0 Changes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Added Prestige scoring (7.5% weight) for companies, universities, and roles</li>
            <li>Skills weight: 55% → 52.5%</li>
            <li>Experience weight: 25% → 22.5%</li>
            <li>Education weight: 10% → 7.5%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
