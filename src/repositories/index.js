import config from "../config/index.js"

import deliveriesRepository from "./deliveries.repo.js"
import ordersRepository from "./orders.repo.js"
import UsersRepository from "./users.repo.js"
import usersInMemoryRepo from "./usersInMemory.repo.js"

let userRepository
let orderRepository
let deliveryRepository 

if(config.nodeEnv === "production"){
    userRepository = UsersRepository
    orderRepository = ordersRepository
    deliveryRepository = deliveriesRepository
}else{
    userRepository = UsersRepository
    orderRepository = ordersRepository
    deliveryRepository = deliveriesRepository
}

export {userRepository, orderRepository, deliveryRepository}


