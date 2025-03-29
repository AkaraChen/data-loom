import * as XLSX from 'xlsx'
import * as yaml from 'js-yaml'
import { saveAs } from 'file-saver'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'
import { unified } from 'unified'
import markdown from 'remark-parse'
import docx from 'remark-docx'

/**
 * Download a file
 * @param file File object to download
 */
export function downloadFile(file: File): void {
  saveAs(file, file.name)
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
function generateOutputFilename(
  inputFilename: string,
  targetExtension: string,
): string {
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

  // Parse markdown to AST
  const mdast = fromMarkdown(markdown)

  // Convert AST to plain text
  const plaintext = toString(mdast)

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
  const content = await getTextFromFile(file)

  // Setup unified processor with remark-parse and remark-docx
  // @ts-expect-error fuck
  const processor = unified().use(markdown).use(docx, { output: 'blob' })

  // Process the markdown content
  const doc = await processor.process(content)
  const blob = (await doc.result) as Blob

  // Generate output filename
  const filename = generateOutputFilename(file.name, 'docx')

  // Create a File object
  return new File([blob], filename, {
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
    return new File([yamlContent], filename, {
      type: 'text/yaml;charset=utf-8',
    })
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
