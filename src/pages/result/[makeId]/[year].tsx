import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'

interface Model {
  Make_ID: number
  Make_Name: string
  Model_ID: number
  Model_Name: string
}

const ModelList: React.FC<{ models: Model[] }> = ({ models }) => (
  <ul className="space-y-2">
    {models.map((model) => (
      <li key={model.Model_ID} className="bg-white p-4 rounded shadow">
        {model.Make_Name} - {model.Model_Name}
      </li>
    ))}
  </ul>
)

export default function ResultPage() {
  const router = useRouter()
  const { makeId, year } = router.query
  const [models, setModels] = React.useState<Model[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (makeId && year) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`)
        .then((response) => response.json())
        .then((data) => {
          setModels(data.Results) 
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching models:', error)
          setLoading(false)
        })
    }
  }, [makeId, year]) // Dependency array ensures this runs when makeId or year changes

  if (loading) {
    return <div>Loading...</div> 
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Vehicle Models</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ModelList models={models} />
      </Suspense>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Back to Filter
      </Link>
    </main>
  )
}

