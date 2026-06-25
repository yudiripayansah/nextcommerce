'use client'

export default function ProductVariantSelector({ options, variants, selectedOptions, onChange }) {
  function selectOption(optionName, value) {
    const next = { ...selectedOptions, [optionName]: value }
    onChange(next)
  }

  function isAvailable(optionName, value) {
    const hypothetical = { ...selectedOptions, [optionName]: value }
    return variants.some((v) => {
      return options.every((opt, i) => {
        const key = `option${i + 1}`
        return v[key] === hypothetical[opt.name]
      })
    })
  }

  return (
    <div className="space-y-4">
      {options.map((opt, i) => (
        <div key={opt.name}>
          <p className="text-sm font-medium text-gray-700 mb-2">
            {opt.name}: <span className="font-normal">{selectedOptions[opt.name] || '-'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const available = isAvailable(opt.name, val)
              const selected = selectedOptions[opt.name] === val
              return (
                <button
                  key={val}
                  onClick={() => available && selectOption(opt.name, val)}
                  disabled={!available}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    selected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : available
                      ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                  }`}
                >
                  {val}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
