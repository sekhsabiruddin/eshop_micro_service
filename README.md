model shopAnalytics {
id String @id @default(auto()) @map("\_id") @db.ObjectId
totalVisitors Int @default(0)

countryStats Json? // Store aggregated country data { "US": 20, "IN": 50, "UK": 15 }
cityStats Json? // Store aggregated city data { "New York": 10, "Delhi": 25 }
deviceStats Json? // Store aggregated device data { "Mobile": 50, "Desktop": 30 }

lastVisitedAt DateTime
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model uniqueShopVisitors {
id String @id @default(auto()) @map("\_id") @db.ObjectId
shopId String @db.ObjectId
userId String @db.ObjectId
visitedAt DateTime @default(now())

@@unique([shopId, userId])
}
model orders {
id String @id @default(auto()) @map("\_id") @db.ObjectId
userId String @db.ObjectId
user users @relation(fields: [userId], references: [id])
shopId String @db.ObjectId
shop shops @relation(fields: [shopId], references: [id])
total Float
shippingAddressId String?
couponCode String?
discountAmount Float?
status String @default("Ordered")
deliveryStatus String
items orderItems[] @relation("OrderItemsRelation")

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
model orderItems {
id String @id @default(auto()) @map("\_id") @db.ObjectId
orderId String @db.ObjectId
productId String
quantity Int
price Float
selectedOptions Json?

orders orders @relation(fields: [orderId], references: [id], name: "OrderItemsRelation")
createdAt DateTime @default(now())
}
enum addressType {
Home
Work
Other
}

model address {
id String @id @default(auto()) @map("\_id") @db.ObjectId
userId String @db.ObjectId
label addressType
name String
street String
city String
zip String
country String
isDefault Boolean @default(true)
createdAt DateTime @default(now())
}
