import config from "../config/index.js"

import deliveriesRepo from "./deliveries.repo.js"
import ordersRepo from "./orders.repo.js"
import usersRepo from "./users.repo.js"
import usersInMemoryRepo from "./usersInMemory.repo.js"

let userRepostiory
let orderRepository
let deliveryRepository 

if(config.nodeEnv === "production"){
    userRepostiory = usersRepo
    orderRepository = ordersRepo
    deliveryRepository = deliveriesRepo
}else{
    userRepostiory = usersInMemoryRepo
    orderRepository = ordersRepo
    deliveryRepository = deliveriesRepo
}

export {userRepostiory, orderRepository, deliveryRepository}


