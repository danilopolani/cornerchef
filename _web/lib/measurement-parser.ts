import React from 'react'

export interface MeasurementMatch {
  value: string
  unit: string
  fullMatch: string
  startIndex: number
  endIndex: number
}

export function extractMeasurements(text: string): MeasurementMatch[] {
  const measurements: MeasurementMatch[] = []
  
  // Common measurement units (both full names and abbreviations)
  const units = [
    // Weight
    'kg', 'kilogram', 'kilograms', 'g', 'gram', 'grams', 'mg', 'milligram', 'milligrams',
    'lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces',
    
    // Volume
    'l', 'liter', 'liters', 'litre', 'litres', 'ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres',
    'gal', 'gallon', 'gallons', 'qt', 'quart', 'quarts', 'pt', 'pint', 'pints',
    'fl oz', 'fluid ounce', 'fluid ounces',
    
    // Cooking measurements
    'cup', 'cups', 'c',
    'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb',
    'teaspoon', 'teaspoons', 'tsp', 't',
    'cucchiaino', 'cucchiaini', // Italian teaspoon
    'cucchiaio', 'cucchiai', // Italian tablespoon
    
    // Count/pieces (only specific cooking measurements)
    'clove', 'cloves',
    'pinch', 'pinches',
    'dash', 'dashes',
    'handful', 'handfuls'
  ]
  
  // Create regex pattern for measurements
  // Matches patterns like: "1", "1/2", "1 1/2", "1.5", "2-3", etc.
  const numberPattern = `(?:\\d+(?:[.,]\\d+)?(?:\\s*[-–—]\\s*\\d+(?:[.,]\\d+)?)?|\\d+\\s+\\d+/\\d+|\\d+/\\d+)`
  const unitPattern = `(?:${units.join('|')})`
  
  // Regex to match measurements: number + optional space + unit
  // Use word boundaries and ensure the entire measurement is properly isolated
  const measurementRegex = new RegExp(
    `(?:^|\\s)(${numberPattern})\\s*(${unitPattern})(?=\\s|$|[^\\w])`,
    'gi'
  )
  
  let match
  while ((match = measurementRegex.exec(text)) !== null) {
    // Calculate the actual start index of the measurement (excluding leading whitespace)
    const leadingWhitespace = match[0].match(/^\s*/)?.[0] || ''
    const actualStartIndex = match.index + leadingWhitespace.length
    const measurementPart = match[0].substring(leadingWhitespace.length)
    
    measurements.push({
      value: match[1].trim(),
      unit: match[2].trim(),
      fullMatch: measurementPart.trim(),
      startIndex: actualStartIndex,
      endIndex: match.index + match[0].length
    })
  }
  
  return measurements
}

export function highlightMeasurements(text: string): React.ReactNode[] {
  const measurements = extractMeasurements(text)
  
  if (measurements.length === 0) {
    return [text]
  }
  
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  
  measurements.forEach((measurement, index) => {
    // Add text before measurement
    if (measurement.startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, measurement.startIndex))
    }
    
    // Add highlighted measurement
    parts.push(
      React.createElement(
        'span',
        {
          key: index,
          className: 'font-bold text-primary'
        },
        measurement.fullMatch
      )
    )
    
    lastIndex = measurement.endIndex
  })
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts
}
