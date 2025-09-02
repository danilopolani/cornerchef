import { describe, it, expect } from 'vitest'
import { extractMeasurements, highlightMeasurements } from '@/lib/measurement-parser'

describe('extractMeasurements', () => {
  it('should extract simple metric measurements', () => {
    const result = extractMeasurements('6g zucchine')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '6',
      unit: 'g',
      fullMatch: '6g',
      startIndex: 0,
      endIndex: 2
    })
  })

  it('should extract measurements with spaces', () => {
    const result = extractMeasurements('6 kg farina')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '6',
      unit: 'kg',
      fullMatch: '6 kg',
      startIndex: 0,
      endIndex: 4
    })
  })

  it('should extract liquid measurements', () => {
    const result = extractMeasurements('300ml latte')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '300',
      unit: 'ml',
      fullMatch: '300ml',
      startIndex: 0,
      endIndex: 5
    })
  })

  it('should extract fractional measurements', () => {
    const result = extractMeasurements('1/2 cucchiaino farina')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '1/2',
      unit: 'cucchiaino',
      fullMatch: '1/2 cucchiaino',
      startIndex: 0,
      endIndex: 14
    })
  })

  it('should extract mixed number measurements', () => {
    const result = extractMeasurements('1 1/2 cups all purpose flour (*see notes for options)')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '1 1/2',
      unit: 'cups',
      fullMatch: '1 1/2 cups',
      startIndex: 0,
      endIndex: 10
    })
  })

  it('should extract full word measurements', () => {
    const result = extractMeasurements('1 tablespoon baking powder')
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      value: '1',
      unit: 'tablespoon',
      fullMatch: '1 tablespoon',
      startIndex: 0,
      endIndex: 12
    })
  })

  it('should extract abbreviated measurements', () => {
    const testCases = [
      { input: '3 tbsp test', expected: '3 tbsp' },
      { input: '2 tbs canola oil', expected: '2 tbs' },
      { input: '1/2 tsp salt', expected: '1/2 tsp' }
    ]

    testCases.forEach(({ input, expected }) => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(1)
      expect(result[0].fullMatch).toBe(expected)
    })
  })

  it('should extract multiple measurements from the same text', () => {
    const result = extractMeasurements('Mix 2 cups flour with 300ml milk and 1 tsp salt')
    expect(result).toHaveLength(3)
    expect(result[0].fullMatch).toBe('2 cups')
    expect(result[1].fullMatch).toBe('300ml')
    expect(result[2].fullMatch).toBe('1 tsp')
  })

  it('should handle text with no measurements', () => {
    const result = extractMeasurements('Salt and pepper to taste')
    expect(result).toHaveLength(0)
  })

  it('should handle empty string', () => {
    const result = extractMeasurements('')
    expect(result).toHaveLength(0)
  })

  // Negative scenarios and edge cases
  it('should not extract numbers without measurement units', () => {
    const testCases = [
      'Add 5 eggs',
      'Cook for 10 minutes',
      'Heat to 350 degrees',
      'Slice into 8 pieces',
      'Bake at 180',
      '2 large onions',
      '3 medium tomatoes'
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should not extract measurement units without numbers', () => {
    const testCases = [
      'Add some cups of flour',
      'A few tablespoons of oil',
      'Several grams of salt',
      'Many teaspoons of vanilla',
      'Lots of ml water',
      'kg of potatoes',
      'tbsp olive oil'
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should not extract invalid number formats', () => {
    const testCases = [
      'Add 1//2 cups flour', // double slash
      'Mix 2..5 kg sugar', // double dot
      'Use 1/2/3 tsp salt', // invalid fraction
      'Add 1 2 cups flour', // space without fraction
      'Mix .5 cups flour', // leading dot without digit
      'Use /2 tsp salt', // fraction without leading number
      'Add 1/ cups flour' // incomplete fraction
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      // Should either find nothing or find valid parts only
      result.forEach(measurement => {
        expect(measurement.fullMatch).not.toContain('//')
        expect(measurement.fullMatch).not.toContain('..')
        expect(measurement.fullMatch).not.toMatch(/^\.|^\//)
      })
    })
  })

  it('should not extract measurements from non-food contexts', () => {
    const testCases = [
      'Drive 5 km to the store',
      'Wait 10 minutes',
      'Room temperature 20 degrees',
      'Add 2 people to the table',
      'Set timer for 30 seconds',
      'Use 220 volts',
      'Screen size 15 inches'
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should handle measurements at word boundaries only', () => {
    const testCases = [
      'something1cup', // no space before number
      'add1/2tsp', // no spaces around
      'mix2tbspsugar', // no spaces
      'use3grams', // no space after number
      'cupboard', // contains 'cup' but not a measurement
      'telegram', // contains 'gram' but not a measurement
      'milkshake' // contains 'ml' but not a measurement
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should handle very long strings without measurements', () => {
    const longText = 'This is a very long recipe description that talks about the history of the dish and how it was prepared by ancient civilizations using traditional methods and techniques that have been passed down through generations without mentioning any specific measurements or quantities.'
    const result = extractMeasurements(longText)
    expect(result).toHaveLength(0)
  })

  it('should handle strings with only punctuation and spaces', () => {
    const testCases = [
      '!@#$%^&*()',
      '   ',
      '...',
      '---',
      ',,, ;;; :::',
      '!!! ??? ...'
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should handle measurements that look valid but are not cooking related', () => {
    const testCases = [
      '5 yards of fabric',
      '10 feet of rope',
      '2 inches of snow',
      '3 miles away',
      '15 seconds left',
      '100 meters high',
      '50 degrees outside'
    ]

    testCases.forEach(input => {
      const result = extractMeasurements(input)
      expect(result).toHaveLength(0)
    })
  })

  it('should extract all user-provided examples correctly', () => {
    const testIngredients = [
      { input: '6g zucchine', expected: ['6g'] },
      { input: '6 kg farina', expected: ['6 kg'] },
      { input: '300ml latte', expected: ['300ml'] },
      { input: '1/2 cucchiaino farina', expected: ['1/2 cucchiaino'] },
      { input: '1 1/2 cups all purpose flour (*see notes for options)', expected: ['1 1/2 cups'] },
      { input: '1 tablespoon baking powder', expected: ['1 tablespoon'] },
      { input: '1/2 teaspoon salt', expected: ['1/2 teaspoon'] },
      { input: '2 tablespoons granulated sugar', expected: ['2 tablespoons'] },
      { input: '3 tbsp test', expected: ['3 tbsp'] },
      { input: '1 cup soy milk', expected: ['1 cup'] },
      { input: '2 tbs canola oil', expected: ['2 tbs'] },
      { input: '1/2 cup water', expected: ['1/2 cup'] }
    ]

    testIngredients.forEach(({ input, expected }) => {
      const result = extractMeasurements(input)
      expect(result.map(m => m.fullMatch)).toEqual(expected)
    })
  })
})

describe('highlightMeasurements', () => {
  it('should return an array with just text when no measurements found', () => {
    const result = highlightMeasurements('Salt and pepper to taste')
    expect(result).toEqual(['Salt and pepper to taste'])
  })

  it('should highlight single measurement', () => {
    const result = highlightMeasurements('2 cups flour')
    expect(result).toHaveLength(2)
    // First element should be the React span with highlighted measurement
    expect(result[0]).toEqual(
      expect.objectContaining({
        type: 'span',
        props: expect.objectContaining({
          className: 'font-bold text-primary',
          children: '2 cups'
        })
      })
    )
    // Second element should be remaining text
    expect(result[1]).toBe(' flour')
  })

  it('should handle text before and after measurement', () => {
    const result = highlightMeasurements('Add 2 cups flour to bowl')
    expect(result).toHaveLength(3)
    expect(result[0]).toBe('Add ')
    expect(result[1]).toEqual(
      expect.objectContaining({
        type: 'span',
        props: expect.objectContaining({
          className: 'font-bold text-primary',
          children: '2 cups'
        })
      })
    )
    expect(result[2]).toBe(' flour to bowl')
  })

  it('should handle multiple measurements', () => {
    const result = highlightMeasurements('Mix 2 cups flour with 300ml milk')
    expect(result).toHaveLength(5)
    expect(result[0]).toBe('Mix ')
    expect(result[1]).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          children: '2 cups'
        })
      })
    )
    expect(result[2]).toBe(' flour with ')
    expect(result[3]).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          children: '300ml'
        })
      })
    )
    expect(result[4]).toBe(' milk')
  })

  // Negative scenarios for highlighting
  it('should handle empty string for highlighting', () => {
    const result = highlightMeasurements('')
    expect(result).toEqual([''])
  })

  it('should handle whitespace-only strings for highlighting', () => {
    const testCases = ['   ', '\t', '\n', ' \t\n ']
    
    testCases.forEach(input => {
      const result = highlightMeasurements(input)
      expect(result).toEqual([input])
    })
  })

  it('should handle strings with numbers but no measurements for highlighting', () => {
    const result = highlightMeasurements('Add 5 eggs and cook for 10 minutes')
    expect(result).toEqual(['Add 5 eggs and cook for 10 minutes'])
  })

  it('should handle strings with measurement words but no numbers for highlighting', () => {
    const result = highlightMeasurements('Add some cups of flour and a few tablespoons of oil')
    expect(result).toEqual(['Add some cups of flour and a few tablespoons of oil'])
  })

  it('should handle special characters and punctuation for highlighting', () => {
    const result = highlightMeasurements('Salt & pepper to taste! No measurements here... 🧂')
    expect(result).toEqual(['Salt & pepper to taste! No measurements here... 🧂'])
  })
})
