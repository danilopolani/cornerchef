declare module 'compressorjs' {
  type ResizeMode = 'none' | 'contain' | 'cover'

  interface CompressorOptions {
    quality?: number
    width?: number
    height?: number
    resize?: ResizeMode
    success?: (result: Blob) => void
    error?: (err: Error) => void
  }

  export default class Compressor {
    constructor(file: File, options: CompressorOptions)
    abort(): void
  }
}


