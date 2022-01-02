import moduleA from './moduleA.js'

console.log('index.js')

function useModuleA() {
  return moduleA(1)
}

export default useModuleA