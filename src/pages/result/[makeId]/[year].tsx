import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Model {
  MakeId: number
  MakeName: string
  VehicleTypeId: number
  VehicleTypeName: string
}

export default function ResultPage() {
  const router = useRouter()
  const { makeId, year } = router.query
  const [models, setModels] = React.useState<Model[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (makeId && year) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`)
        .then(response => response.json())
        .then(data => {
          setModels(data.Results)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching models:', error)
          setLoading(false)
        })
    }
  }, [makeId, year])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Vehicle Models</h1>
      <ul className="space-y-2">
        {models.map((model) => (
          <li key={model.VehicleTypeId} className="bg-white p-4 rounded shadow">
            {model.MakeName} - {model.VehicleTypeName}
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        Back to Filter
      </Link>
    </main>
  )
}

