import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"


interface Model {
  Make_ID: number
  Make_Name: string
  Model_ID: number
  Model_Name: string
}

export default function ResultPage() {
  const router = useRouter();
  const { makeId, year } = router.query;

  const [models, setModels] = React.useState<Model[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (makeId && year) {
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          setModels(data.Results);
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
            Vehicle Models
          </h1>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Skeletons simulating Card content */}
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4">
                <Skeleton className="w-24 h-6 mb-4" />
                <Skeleton className="w-32 h-5 mb-2" />
                <Skeleton className="w-28 h-5" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
          Vehicle Models in {year}
        </h1>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Card key={model.Model_ID} className="p-4">
              <h4 className="text-sm font-semibold leading-none">{model.Model_Name}</h4>
              <Separator className="my-4"/>
              <div className="flex h-5 items-center space-x-4 text-sm">
                <p className="text-gray-500">{model.Make_Name}</p>
                <Separator orientation="vertical" />
                <p className="text-gray-500">Model ID: {model.Model_ID}</p>

              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="link" size="lg">
            <Link href="/">Back to Filter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

