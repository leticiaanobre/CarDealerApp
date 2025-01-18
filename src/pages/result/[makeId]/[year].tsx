"use client";

import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Car } from 'lucide-react'
import type { GetStaticPaths, GetStaticProps } from 'next'

interface Model {
  Make_ID: number
  Make_Name: string
  Model_ID: number
  Model_Name: string
}

interface ResultPageProps {
  models: Model[]
}

async function fetchModels(makeId: string, year: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  const data = await res.json();
  return data.Results;
}

//Initially I didn't need to use getStaticPaths, but how it was required, I'm using the getStaticPaths instead of generateStaticParams (once I'm using the pages form and not the app router one)
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vehicles/GetMakesForVehicleType/car?format=json`);
  const { Results: makes } = await res.json();
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  
  const paths = makes.slice(0, 10).flatMap((make: { MakeId: number }) =>
    years.map((year) => ({
      params: { makeId: make.MakeId.toString(), year }
    }))
  );

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<ResultPageProps> = async ({ params }) => {
  if (!params?.makeId || !params?.year) {
    return { notFound: true };
  }

  try {
    const models = await fetchModels(params.makeId as string, params.year as string);
    return {
      props: { models },
      revalidate: 3600
    };
  } catch {
    return { notFound: true };
  }
};

export default function ResultPage({ models }: ResultPageProps) {
  const { query: { year } } = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center gap-8">
          <Button asChild variant="default" size="lg">
            <Link href="/">Back to Filter</Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">
            Vehicle Models in {year}
          </h1>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {models.map((model, index) => (
            <Card 
              key={model.Model_ID} 
              className="p-4 opacity-0 animate-slideIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{model.Model_Name}</h4>
                <div className="bg-orange-100 p-2 rounded-xl">
                  <Car size={24} strokeWidth={1.5} color="#e34d0d" />
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{model.Make_Name}</span>
                <Separator orientation="vertical" />
                <span>ID: {model.Model_ID}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}