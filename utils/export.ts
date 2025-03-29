import { marked } from 'marked'
import * as XLSX from 'xlsx'
import * as yaml from 'js-yaml'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

/**
 * Download a file
 * @param file File object to download
 */
export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Helper function to get text content from a File object
 * @param file File object
 * @returns Promise resolving to the text content
 */
export function getTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * Helper function to generate output filename based on input filename and target extension
 * @param inputFilename Original filename
 * @param targetExtension Target file extension (without dot)
 * @returns New filename with the target extension
 */
function generateOutputFilename(inputFilename: string, targetExtension: string): string {
  // Remove the original extension and add the new one
  return `${inputFilename.replace(/\.[^/.]+$/, '')}.${targetExtension}`
}

/**
 * Convert Markdown file to plaintext
 * @param file Markdown file
 * @returns Promise resolving to a File object with plaintext content
 */
export async function markdownToPlaintext(file: File): Promise<File> {
  // Get the content from the file
  const markdown = await getTextFromFile(file)
  
  // Generate output filename
  const filename = generateOutputFilename(file.name, 'txt')
  
  // Use marked to convert markdown to HTML
  const html = marked(markdown, { async: false })

  // Create a temporary element to parse HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // Extract text content
  const plaintext = tempElement.textContent || tempElement.innerText || ''

  // Create a File object
  return new File([plaintext], filename, { type: 'text/plain;charset=utf-8' })
}

/**
 * Convert Markdown file to DOCX format
 * @param file Markdown file
 * @returns Promise resolving to a File object with DOCX content
 */
export async function markdownToDocx(file: File): Promise<File> {
  // Get the content from the file
  const markdown = await getTextFromFile(file)
  
  // Generate output filename
  const filename = generateOutputFilename(file.name, 'docx')
  
  // Use marked to convert markdown to HTML
  const html = marked(markdown, { async: false })

  // Create a temporary element to parse HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // Extract text content
  const plaintext = tempElement.textContent || tempElement.innerText || ''

  // Split plaintext into paragraphs
  const paragraphs = plaintext.split('\n').filter(line => line.trim() !== '')

  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.map(
          para =>
            new Paragraph({
              children: [new TextRun(para)],
            }),
        ),
      },
    ],
  })

  // Generate the DOCX file
  const buffer = await Packer.toBuffer(doc)

  // Create a File object
  return new File([buffer], filename, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}

/**
 * Convert CSV file to XLSX format
 * @param file CSV file
 * @returns Promise resolving to a File object with XLSX content
 */
export async function csvToXlsx(file: File): Promise<File> {
  // Get the content from the file
  const csvContent = await getTextFromFile(file)
  
  // Generate output filename
  const filename = generateOutputFilename(file.name, 'xlsx')
  
  // Parse CSV data
  const workbook = XLSX.read(csvContent, { type: 'string' })

  // Generate XLSX file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  // Create a File object
  return new File([excelBuffer], filename, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Convert JSON file to YAML format
 * @param file JSON file
 * @returns Promise resolving to a File object with YAML content
 */
export async function jsonToYaml(file: File): Promise<File> {
  // Get the content from the file
  const jsonContent = await getTextFromFile(file)
  
  // Generate output filename
  const filename = generateOutputFilename(file.name, 'yml')
  
  try {
    // Parse JSON
    const jsonObject = JSON.parse(jsonContent)
    
    // Convert to YAML
    const yamlContent = yaml.dump(jsonObject, {
      indent: 2,
      lineWidth: -1, // No line wrapping
      noRefs: true, // Don't output YAML references
    })
    
    // Create a File object
    return new File([yamlContent], filename, { type: 'text/yaml;charset=utf-8' })
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Convert string content to a specific format
 * These utility functions are kept for backward compatibility
 * and for cases where you already have the content as a string
 */

/**
 * Convert Markdown string to plaintext
 * @param markdown Markdown content
 * @param filename Output filename
 * @returns File object with plaintext content
 */
export function markdownStringToPlaintext(markdown: string, filename: string): File {
  // Use marked to convert markdown to HTML
  const html = marked(markdown, { async: false })

  // Create a temporary element to parse HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // Extract text content
  const plaintext = tempElement.textContent || tempElement.innerText || ''

  // Create a File object
  return new File([plaintext], filename, { type: 'text/plain;charset=utf-8' })
}

/**
 * Convert Markdown string to DOCX format
 * @param markdown Markdown content
 * @param filename Output filename
 * @returns Promise resolving to a File object with DOCX content
 */
export async function markdownStringToDocx(
  markdown: string,
  filename: string,
): Promise<File> {
  // Use marked to convert markdown to HTML
  const html = marked(markdown, { async: false })

  // Create a temporary element to parse HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // Extract text content
  const plaintext = tempElement.textContent || tempElement.innerText || ''

  // Split plaintext into paragraphs
  const paragraphs = plaintext.split('\n').filter(line => line.trim() !== '')

  // Create a new document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.map(
          para =>
            new Paragraph({
              children: [new TextRun(para)],
            }),
        ),
      },
    ],
  })

  // Generate the DOCX file
  const buffer = await Packer.toBuffer(doc)

  // Create a File object
  return new File([buffer], filename, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
}

/**
 * Convert CSV string to XLSX format
 * @param csvContent CSV content
 * @param filename Output filename
 * @returns File object with XLSX content
 */
export function csvStringToXlsx(csvContent: string, filename: string): File {
  // Parse CSV data
  const workbook = XLSX.read(csvContent, { type: 'string' })

  // Generate XLSX file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  // Create a File object
  return new File([excelBuffer], filename, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Convert JSON string or object to YAML string
 * @param jsonContent JSON content (string or object)
 * @returns YAML content as string
 */
export function jsonStringToYamlString(jsonContent: string | object): string {
  // Parse JSON if it's a string
  const jsonObject =
    typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent

  // Convert to YAML
  return yaml.dump(jsonObject, {
    indent: 2,
    lineWidth: -1, // No line wrapping
    noRefs: true, // Don't output YAML references
  })
}

/**
 * Convert JSON string or object to YAML file
 * @param jsonContent JSON content (string or object)
 * @param filename Output filename
 * @returns File object with YAML content
 */
export function jsonStringToYamlFile(
  jsonContent: string | object,
  filename: string,
): File {
  const yamlContent = jsonStringToYamlString(jsonContent)
  
  // Create a File object
  return new File([yamlContent], filename, { type: 'text/yaml;charset=utf-8' })
}
