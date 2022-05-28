const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const pkg = require("../Package")
const Package = pkg.Package
const PackageType = pkg.PackageType

const helper = require("../../test/helper.test")
const DeliveryStepType = helper.DeliveryStepType
const delivery_step = helper.delivery_step
const user = helper.user

const Shipment = require("../Shipment").Shipment

;(async function () {
  
  const ipfs = await IPFS.create()
  const orbitdb = await OrbitDB.createInstance(ipfs)

  // Create / Open a database
  const db = await orbitdb.docs("shipment")
//   const db = await orbitdb.log("hello")
  await db.load()

  // Listen for updates from peers
  db.events.on("replicated", address => {
    console.log(db.iterator({ limit: -1 }).collect())
  })

  const user_test = user(1, 1, 1, 1);
  const shipment = Shipment.create(new Package(PackageType.NonPerishable), user_test.sender, user_test.receiver);
  const deliveryStep = delivery_step(DeliveryStepType.DeliveryByDispatcherFromSenderToReceiver)
  const deliverRequest = user_test.dispatcher.bid(shipment, {amount: 23, currency: 'ADA'}, deliveryStep);

  // Add an entry
  const hash = await db.put(shipment)
  console.log(hash)

  // Query
  const result = db.get({ limit: -1 })
  console.log(JSON.stringify(result, null, 2))
})()