import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectLabel, SelectGroup } from '@/components/ui/select'

interface Make {
  MakeId: number
  MakeName: string
}

export default function Home() {
  const [makes, setMakes] = useState<Make[]>([])
  const [selectedMake, setSelectedMake] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => (currentYear - i).toString())

  useEffect(() => {
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
      .then(response => response.json())
      .then(data => setMakes(data.Results))
  }, [])

  const handleNext = () => {
    if (selectedMake && selectedYear) {
      router.push(`/result/${selectedMake}/${selectedYear}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Vehicle Filter</h1>
      <div className="w-full max-w-xs space-y-4">
        <Select value={selectedMake} onValueChange={setSelectedMake}>
          <SelectGroup>
            <SelectLabel className="text-sm font-semibold text-gray-700">Make</SelectLabel>
            <SelectTrigger className="w-full p-2 border rounded">
              <span>{selectedMake || "Select Make"}</span>
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make.MakeId} value={make.MakeId.toString()}>
                  {make.MakeName}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectGroup>
            <SelectLabel className="text-sm font-semibold text-gray-700">Year</SelectLabel>
            <SelectTrigger className="w-full p-2 border rounded">
              <span>{selectedYear || "Select Year"}</span>
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </Select>


        <button
          onClick={handleNext}
          className={`w-full p-2 rounded ${
            !selectedMake || !selectedYear
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={!selectedMake || !selectedYear}
        >
          Next
        </button>
      </div>
    </main>
  )
}
