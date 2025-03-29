import { marked } from 'marked'
import * as XLSX from 'xlsx'
import * as yaml from 'js-yaml'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

/**
 * Download a file
 * @param name File name
 * @param content File content
 */
export function downloadFile(name: string, content: Blob) {
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Convert Markdown to plaintext by removing Markdown formatting
 * @param markdown Markdown content
 * @returns Plain text content
 */
export function markdownToPlaintext(markdown: string): string {
  // Use marked to convert markdown to HTML
  const html = marked(markdown, { async: false })

  // Create a temporary element to parse HTML
  const tempElement = document.createElement('div')
  tempElement.innerHTML = html

  // Extract text content
  const plaintext = tempElement.textContent || tempElement.innerText || ''

  return plaintext
}

/**
 * Convert Markdown to DOCX format
 * @param markdown Markdown content
 * @param filename Output filename
 */
export async function markdownToDocx(
  markdown: string,
  filename: string,
): Promise<void> {
  // Convert markdown to plaintext first
  const plaintext = markdownToPlaintext(markdown)

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

  // Create a Blob from the buffer
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  // Download the file
  saveAs(blob, filename)
}

/**
 * Convert CSV to XLSX format
 * @param csvContent CSV content
 * @param filename Output filename
 */
export function csvToXlsx(csvContent: string, filename: string): void {
  // Parse CSV data
  const workbook = XLSX.read(csvContent, { type: 'string' })

  // Generate XLSX file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Download the file
  saveAs(blob, filename)
}

/**
 * Convert JSON to YAML format
 * @param jsonContent JSON content (string or object)
 * @returns YAML content as string
 */
export function jsonToYaml(jsonContent: string | object): string {
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
 * Convert JSON to YAML and download as a file
 * @param jsonContent JSON content (string or object)
 * @param filename Output filename
 */
export function jsonToYamlFile(
  jsonContent: string | object,
  filename: string,
): void {
  const yamlContent = jsonToYaml(jsonContent)

  // Create a Blob from the YAML content
  const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })

  // Download the file
  downloadFile(filename, blob)
}
