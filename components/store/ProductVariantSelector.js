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
          <p className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-text)' }}>
            {opt.name}:{' '}
            <span className="font-normal normal-case tracking-normal" style={{ color: 'var(--color-text-muted)' }}>
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
                  className="min-w-[44px] px-3 py-2 text-sm font-medium border transition-all rounded-sm relative overflow-hidden"
                  style={selected
                    ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderColor: 'var(--color-primary)' }
                    : available
                    ? { color: 'var(--color-text)', borderColor: 'var(--color-border)' }
                    : { color: 'var(--color-border)', borderColor: 'var(--color-border)', cursor: 'not-allowed' }}
                >
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-full rotate-45" style={{ borderTop: '1px solid var(--color-border)' }} />
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
