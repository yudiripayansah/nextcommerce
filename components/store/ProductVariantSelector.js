'use client'

export default function ProductVariantSelector({ options, variants, selectedOptions, onChange }) {
  function selectOption(optionName, value) {
    onChange({ ...selectedOptions, [optionName]: value })
  }

  function isAvailable(optionName, value) {
    const hypothetical = { ...selectedOptions, [optionName]: value }
    return variants.some((v) =>
      options.every((opt, i) => v[`option${i + 1}`] === hypothetical[opt.name])
    )
  }

  return (
    <div className="space-y-5">
      {options.map((opt) => (
        <div key={opt.name}>
          <p className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
            {opt.name}:{' '}
            <span className="font-normal normal-case tracking-normal text-gray-600">
              {selectedOptions[opt.name] || '-'}
            </span>
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
                  className={`min-w-[44px] px-3 py-2 text-sm font-medium border transition-all rounded-sm ${
                    selected
                      ? ''
                      : available
                      ? 'border-gray-300 text-gray-800 hover:opacity-80'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed relative overflow-hidden'
                  }`}
                  style={selected ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderColor: 'var(--color-primary)' } : undefined}
                >
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full border-t border-gray-300 rotate-45" />
                    </span>
                  )}
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
