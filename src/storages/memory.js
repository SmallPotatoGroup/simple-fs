import BaseStorage from './base'

export default class MemoryStorage extends BaseStorage {
  constructor (storageName) {
    super(storageName)

    this.name = 'memory'
    this.data = {}
  }

  async create (path, node, parentId) {
    this.data[path] = { path: path, node: node, parentId: parentId }
    return path
  }

  async remove (path) {
    if (path in this.data) {
      delete this.data[path]
    }
    return undefined
  }

  async put (path, node, parentId) {
    return this.create(path, node, parentId)
  }

  async get (path) {
    const keys = Object.keys(this.data)

    for (let i = 0; i < keys.length; i++) {
      if (this.data[keys[i]].path === path) {
        return this.data[keys[i]]
      }
    }
    return undefined
  }

  async where (params) {
    let ret = []
    let paramsKeys = Object.keys(params)

    Object.keys(this.data).forEach((d) => {
      let canBe = true
      let object = this.data[d]
      paramsKeys.forEach((param) => {
        if (object[param] !== params[param]) canBe = false
      })
      if (canBe) ret.push(object)
    })
    return ret
  }

  async isEmpty (parentId) {
    let count = 0
    const keys = Object.keys(this.data)

    for (let i = 0; i < keys.length; i++) {
      if (this.data[keys[i]].parentId === parentId) {
        count += 1
      }
    }
    return count === 0
  }
}
