var Illuminati = require('../')
var crypto = require('crypto')
var tape = require('tape')
var seeds = require('./seeds')

//deterministic keys make testing easy.
function hash (s) {
  return crypto.createHash('sha256').update(s).digest()
}

var appkey = hash('test_key')

var create = Illuminati({
  appKey: appkey,
}).use({
  manifest: {
    hello: 'sync'
  },
  permissions: {
    anonymous: { allow: ['hello'], deny: null }
  },
  init: function (api) {
    return {
      hello: function (name) {
        return 'Hello, ' + name + '.'
      }
    }
  }
})

var alice = create({ seed: seeds.alice })
var bob = create({ seed: seeds.bob })

tape('alice connects to bob', function (t) {

  alice.connect(bob.address(), function (err, rpc) {
    if(err) throw err

    rpc.hello('Alice', function (err, data) {
      if(err) throw err
      t.equal(data, 'Hello, Alice.')
      alice.close(true); bob.close(true)
      console.log(data)
      t.end()
    })

  })

})

tape('cleanup', function (t) {
  alice.close(true); bob.close(true)
  t.end()
})
