// components/CleaningControls.tsx
'use client';

import { useState } from 'react';

interface CleaningOptions {
  // Basic cleaning
  removeDuplicates: boolean;
  trimWhitespace: boolean;
  removeEmptyRows: boolean;
  standardizeCase: boolean;
  removeSpecialChars: boolean;
  
  // Text & String cleaning
  fixEncoding: boolean;
  removeExtraSpaces: boolean;
  removeLineBreaks: boolean;
  removeHtmlTags: boolean;
  normalizeQuotes: boolean;
  
  // Data type & format cleaning
  standardizePhones: boolean;
  standardizeEmails: boolean;
  standardizeDates: boolean;
  cleanCurrency: boolean;
  fixNumbers: boolean;
  standardizeBooleans: boolean;
  
  // Data quality & validation
  removeEmptyColumns: boolean;
  fillEmptyWith: string;
  removeMissingCritical: boolean;
  flagSuspiciousData: boolean;
  
  // Advanced text processing
  removeProfanity: boolean;
  spellCheck: boolean;
  removeStopWords: boolean;
  extractUrls: boolean;
  extractEmails: boolean;
  maskSensitive: boolean;
  
  // Data transformation
  splitNames: boolean;
  mergeColumns: boolean;
  addTimestamp: boolean;
  generateIds: boolean;
}

interface CleaningControlsProps {
  options: CleaningOptions;
  setOptions: (opts: CleaningOptions) => void;
  processing: boolean;
}

export default function CleaningControls({ 
  options,
  setOptions,
  processing
}: CleaningControlsProps) {
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  const CheckboxWithTooltip = ({ 
    id, 
    label, 
    checked, 
    onChange, 
    tooltip, 
    icon = "📝",
    disabled = false 
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    tooltip: string;
    icon?: string;
    disabled?: boolean;
  }) => (
    <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all group">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
        disabled={processing || disabled}
      />
      <label htmlFor={id} className="ml-3 block text-sm font-medium text-green-800 flex-1">
        {icon} {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onMouseEnter={() => setTooltipVisible(id)}
          onMouseLeave={() => setTooltipVisible(null)}
          className="ml-2 w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold transition-colors"
        >
          i
        </button>
        {tooltipVisible === id && (
          <div className="absolute right-0 top-8 z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
            <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 rotate-45"></div>
            {tooltip}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 shadow-lg">
      {/* <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
        🛠️ Data Cleaning Options
      </h3> */}
      
      {/* Basic Data Quality Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          📊 Basic Data Quality
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxWithTooltip
            id="removeDuplicates"
            label="Remove duplicate rows"
            checked={options.removeDuplicates}
            onChange={(checked) => setOptions({...options, removeDuplicates: checked})}
            tooltip="Removes rows that have identical data across all columns. Helps eliminate redundant entries."
            icon="🔄"
          />
          <CheckboxWithTooltip
            id="removeEmptyRows"
            label="Remove empty rows"
            checked={options.removeEmptyRows}
            onChange={(checked) => setOptions({...options, removeEmptyRows: checked})}
            tooltip="Removes rows where all cells are empty or contain only whitespace."
            icon="🗑️"
          />
          <CheckboxWithTooltip
            id="removeEmptyColumns"
            label="Remove empty columns"
            checked={options.removeEmptyColumns}
            onChange={(checked) => setOptions({...options, removeEmptyColumns: checked})}
            tooltip="Removes columns that contain no data or only empty values across all rows."
            icon="📤"
          />
          <CheckboxWithTooltip
            id="flagSuspiciousData"
            label="Flag suspicious data"
            checked={options.flagSuspiciousData}
            onChange={(checked) => setOptions({...options, flagSuspiciousData: checked})}
            tooltip="Identifies potentially problematic data like unusual characters, extreme values, or inconsistent formats."
            icon="⚠️"
          />
        </div>
      </div>

      {/* Text & String Cleaning Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          ✂️ Text & String Cleaning
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxWithTooltip
            id="trimWhitespace"
            label="Trim whitespace"
            checked={options.trimWhitespace}
            onChange={(checked) => setOptions({...options, trimWhitespace: checked})}
            tooltip="Removes leading and trailing spaces from all text cells. Essential for data consistency."
            icon="✂️"
          />
          <CheckboxWithTooltip
            id="removeExtraSpaces"
            label="Remove extra spaces"
            checked={options.removeExtraSpaces}
            onChange={(checked) => setOptions({...options, removeExtraSpaces: checked})}
            tooltip="Converts multiple consecutive spaces into single spaces within text."
            icon="🔤"
          />
          <CheckboxWithTooltip
            id="standardizeCase"
            label="Standardize case"
            checked={options.standardizeCase}
            onChange={(checked) => setOptions({...options, standardizeCase: checked})}
            tooltip="Converts all text to lowercase for consistency. Useful for names, emails, and categories."
            icon="Aa"
          />
          <CheckboxWithTooltip
            id="removeSpecialChars"
            label="Remove special characters"
            checked={options.removeSpecialChars}
            onChange={(checked) => setOptions({...options, removeSpecialChars: checked})}
            tooltip="Removes non-alphanumeric characters except spaces. Keeps only letters, numbers, and spaces."
            icon="🔸"
          />
          <CheckboxWithTooltip
            id="removeLineBreaks"
            label="Remove line breaks"
            checked={options.removeLineBreaks}
            onChange={(checked) => setOptions({...options, removeLineBreaks: checked})}
            tooltip="Removes line breaks and newline characters from within cells, converting to single-line text."
            icon="↩️"
          />
          <CheckboxWithTooltip
            id="removeHtmlTags"
            label="Remove HTML tags"
            checked={options.removeHtmlTags}
            onChange={(checked) => setOptions({...options, removeHtmlTags: checked})}
            tooltip="Strips HTML tags from text, useful for cleaning web-scraped data."
            icon="🏷️"
          />
          <CheckboxWithTooltip
            id="normalizeQuotes"
            label="Normalize quotes"
            checked={options.normalizeQuotes}
            onChange={(checked) => setOptions({...options, normalizeQuotes: checked})}
            tooltip="Converts smart quotes (curly quotes) to standard straight quotes for consistency."
            icon="❝"
          />
          <CheckboxWithTooltip
            id="fixEncoding"
            label="Fix encoding issues"
            checked={options.fixEncoding}
            onChange={(checked) => setOptions({...options, fixEncoding: checked})}
            tooltip="Attempts to fix common text encoding problems like strange characters or symbols."
            icon="🔧"
          />
        </div>
      </div>

      {/* Data Format Standardization Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          📋 Data Format Standardization
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxWithTooltip
            id="standardizePhones"
            label="Standardize phone numbers"
            checked={options.standardizePhones}
            onChange={(checked) => setOptions({...options, standardizePhones: checked})}
            tooltip="Formats phone numbers to a consistent pattern like +1-XXX-XXX-XXXX or (XXX) XXX-XXXX."
            icon="📞"
          />
          <CheckboxWithTooltip
            id="standardizeEmails"
            label="Standardize email addresses"
            checked={options.standardizeEmails}
            onChange={(checked) => setOptions({...options, standardizeEmails: checked})}
            tooltip="Converts emails to lowercase and trims whitespace for consistency."
            icon="📧"
          />
          <CheckboxWithTooltip
            id="standardizeDates"
            label="Standardize dates"
            checked={options.standardizeDates}
            onChange={(checked) => setOptions({...options, standardizeDates: checked})}
            tooltip="Converts dates to a consistent format (MM/DD/YYYY). Handles various input formats."
            icon="📅"
          />
          <CheckboxWithTooltip
            id="cleanCurrency"
            label="Clean currency values"
            checked={options.cleanCurrency}
            onChange={(checked) => setOptions({...options, cleanCurrency: checked})}
            tooltip="Removes currency symbols ($, €, £) and formats numbers consistently with proper decimals."
            icon="💰"
          />
          <CheckboxWithTooltip
            id="fixNumbers"
            label="Fix number formats"
            checked={options.fixNumbers}
            onChange={(checked) => setOptions({...options, fixNumbers: checked})}
            tooltip="Removes commas from large numbers and standardizes decimal places."
            icon="🔢"
          />
          <CheckboxWithTooltip
            id="standardizeBooleans"
            label="Standardize boolean values"
            checked={options.standardizeBooleans}
            onChange={(checked) => setOptions({...options, standardizeBooleans: checked})}
            tooltip="Converts Yes/No, True/False, 1/0 to consistent true/false values."
            icon="✅"
          />
        </div>
      </div>

      {/* Advanced Text Processing Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          🧠 Advanced Text Processing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxWithTooltip
            id="removeProfanity"
            label="Remove profanity"
            checked={options.removeProfanity}
            onChange={(checked) => setOptions({...options, removeProfanity: checked})}
            tooltip="Filters out inappropriate language and replaces with asterisks or removes entirely."
            icon="🚫"
          />
          <CheckboxWithTooltip
            id="spellCheck"
            label="Basic spell check"
            checked={options.spellCheck}
            onChange={(checked) => setOptions({...options, spellCheck: checked})}
            tooltip="Attempts to correct common spelling mistakes in text data."
            icon="📝"
          />
          <CheckboxWithTooltip
            id="removeStopWords"
            label="Remove stop words"
            checked={options.removeStopWords}
            onChange={(checked) => setOptions({...options, removeStopWords: checked})}
            tooltip="Removes common words like 'the', 'and', 'is' - useful for text analysis."
            icon="🔍"
          />
          <CheckboxWithTooltip
            id="extractUrls"
            label="Extract URLs"
            checked={options.extractUrls}
            onChange={(checked) => setOptions({...options, extractUrls: checked})}
            tooltip="Finds and extracts web URLs from text into a separate column."
            icon="🔗"
          />
          <CheckboxWithTooltip
            id="extractEmails"
            label="Extract email addresses"
            checked={options.extractEmails}
            onChange={(checked) => setOptions({...options, extractEmails: checked})}
            tooltip="Finds and extracts email addresses from text into a separate column."
            icon="📮"
          />
          <CheckboxWithTooltip
            id="maskSensitive"
            label="Mask sensitive data"
            checked={options.maskSensitive}
            onChange={(checked) => setOptions({...options, maskSensitive: checked})}
            tooltip="Detects and masks potential sensitive data like SSN, credit cards with asterisks."
            icon="🔒"
          />
        </div>
      </div>

      {/* Data Transformation Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          🔄 Data Transformation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxWithTooltip
            id="splitNames"
            label="Split full names"
            checked={options.splitNames}
            onChange={(checked) => setOptions({...options, splitNames: checked})}
            tooltip="Splits 'Full Name' columns into separate 'First Name' and 'Last Name' columns."
            icon="👥"
          />
          <CheckboxWithTooltip
            id="mergeColumns"
            label="Merge related columns"
            checked={options.mergeColumns}
            onChange={(checked) => setOptions({...options, mergeColumns: checked})}
            tooltip="Combines related columns like 'First Name' + 'Last Name' into 'Full Name'."
            icon="🔗"
          />
          <CheckboxWithTooltip
            id="addTimestamp"
            label="Add processing timestamp"
            checked={options.addTimestamp}
            onChange={(checked) => setOptions({...options, addTimestamp: checked})}
            tooltip="Adds a column with the current date/time when the data was processed."
            icon="⏰"
          />
          <CheckboxWithTooltip
            id="generateIds"
            label="Generate unique IDs"
            checked={options.generateIds}
            onChange={(checked) => setOptions({...options, generateIds: checked})}
            tooltip="Adds an auto-incrementing ID column to uniquely identify each row."
            icon="🔑"
          />
        </div>
      </div>

      {/* Fill Empty Cells Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-300 pb-2">
          📝 Fill Empty Cells
        </h4>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <CheckboxWithTooltip
            id="fillEmpty"
            label="Fill empty cells with:"
            checked={options.fillEmptyWith !== ''}
            onChange={(checked) => setOptions({...options, fillEmptyWith: checked ? 'N/A' : ''})}
            tooltip="Replaces empty cells with a default value to ensure data consistency."
            icon="📄"
          />
          <input
            type="text"
            value={options.fillEmptyWith}
            onChange={(e) => setOptions({...options, fillEmptyWith: e.target.value})}
            placeholder="Default value (e.g., N/A, 0, Unknown)"
            className="px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={processing}
          />
        </div>
      </div>
    </div>
  );
}
