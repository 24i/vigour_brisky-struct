const getProperties = t => t.properties || getProperties(t.inherits)

const properties = {
  child: (t, val, key, stamp) => {
    // lets do child
  },
  instances: (t, val, key, stamp) => {
    t.instances = val
  },
  types: () => {
    // some types
  },
  $transform: (t, val) => {
    t.$transform = val
  },
  properties: (t, val, key, stamp) => {
    // need to update instances
    var properties = t.properties
    if (!properties) {
      const previous = getProperties(t)
      properties = t.properties = {}
      if (previous) {
        for (let key in previous) {
          properties[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      // here well do similair behvaiours of course
      // big advantges of this system is that we can use delete
      properties[key] = val[key]
    }
    if (properties.propertiesMap) {
      delete properties.propertiesMap
    }
  }
}

exports.properties = properties

