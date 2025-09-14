import React from 'react'
import { Text } from 'react-native'

export interface MeasurementMatch {
  value: string
  unit: string
  fullMatch: string
  startIndex: number
  endIndex: number
}

export function extractMeasurements(text: string): MeasurementMatch[] {
  const measurements: MeasurementMatch[] = []

  const units = [
    'kg', 'kilogram', 'kilograms', 'g', 'gram', 'grams', 'mg', 'milligram', 'milligrams',
    'lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces',

    'l', 'liter', 'liters', 'litre', 'litres', 'ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres',
    'gal', 'gallon', 'gallons', 'qt', 'quart', 'quarts', 'pt', 'pint', 'pints',
    'fl oz', 'fluid ounce', 'fluid ounces',

    'cup', 'cups', 'c',
    'tablespoon', 'tablespoons', 'tbsp', 'tbs', 'tb',
    'teaspoon', 'teaspoons', 'tsp', 't',
    'cucchiaino', 'cucchiaini',
    'cucchiaio', 'cucchiai',

    'clove', 'cloves',
    'pinch', 'pinches',
    'dash', 'dashes',
    'handful', 'handfuls'
  ]

  const numberPattern = `(?:\\d+(?:[.,]\\d+)?(?:\\s*[-–—]\\s*\\d+(?:[.,]\\d+)?)?|\\d+\\s+\\d+/\\d+|\\d+/\\d+)`
  const unitPattern = `(?:${units.join('|')})`

  const measurementRegex = new RegExp(
    `(?:^|\\s)(${numberPattern})\\s*(${unitPattern})(?=\\s|$|[^\\w])`,
    'gi'
  )

  let match
  while ((match = measurementRegex.exec(text)) !== null) {
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

// React Native-friendly highlighter that returns an array of nodes (strings and <Text>)
export function highlightMeasurements(text: string): React.ReactNode[] {
  const measurements = extractMeasurements(text)

  if (measurements.length === 0) {
    return [text]
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  measurements.forEach((measurement, index) => {
    if (measurement.startIndex > lastIndex) {
      parts.push(text.slice(lastIndex, measurement.startIndex))
    }

    parts.push(
      React.createElement(
        Text,
        {
          key: `m-${index}`,
          className: 'font-bold text-primary'
        } as any,
        measurement.fullMatch
      )
    )

    lastIndex = measurement.endIndex
  })

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}


