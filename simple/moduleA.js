import moduleB from './subfolder/moduleB.js'

console.log('moduleA.js')

function useModuleB(value) {
  return moduleB(value + 1)
}

export default useModuleB