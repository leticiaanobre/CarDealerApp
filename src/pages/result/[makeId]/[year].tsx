import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Suspense, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Model {
  Make_ID: number
  Make_Name: string
  Model_ID: number
  Model_Name: string
}

const fetchModels = async (makeId: string, year: string) => {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  const data = await res.json();
  return data.Results;
};

const ModelsList = ({ makeId, year }: { makeId: string, year: string }) => {
  const [models, setModels] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (makeId && year) {
      fetchModels(makeId, year)
        .then((data) => {
          setModels(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching models:", error);
          setLoading(false);
        });
    }
  }, [makeId, year]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="w-24 h-6 mb-4" />
            <Skeleton className="w-32 h-5 mb-2" />
            <Skeleton className="w-28 h-5" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model, index) => (
        <Card key={model.Model_ID} className={`p-4 opacity-0 animate-slideIn`} style={{ animationDelay: `${index * 0.1}s` }}>
          <h4 className="text-sm font-semibold leading-none">{model.Model_Name}</h4>
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <p className="text-gray-500">{model.Make_Name}</p>
            <Separator orientation="vertical" />
            <p className="text-gray-500">Model ID: {model.Model_ID}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default function ResultPage() {
  const router = useRouter();
  const { makeId, year } = router.query;

  const [showPageContent, setShowPageContent] = React.useState(false);

  useEffect(() => {
    setShowPageContent(true);
  }, []);

  if (!makeId || !year) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`min-h-screen bg-gray-50 p-8 transition-all duration-1000 ${showPageContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto">
        <div className="text-center flex flex-row gap-8">
          <Button asChild variant="default" size="lg" className="opacity-0 animate-slideIn" style={{ animationDelay: '0.2s' }}>
            <Link href="/">Back to Filter</Link>
          </Button>
          <h1 className="text-center text-4xl font-bold mb-6 text-gray-800 opacity-0 animate-slideIn" style={{ animationDelay: '0.1s' }}>
            Vehicle Models in {year}
          </h1>
        </div>
        
        <Suspense fallback={<div>Loading models...</div>}>
          <ModelsList makeId={makeId as string} year={year as string} />
        </Suspense>
      </div>
    </main>
  );
}
