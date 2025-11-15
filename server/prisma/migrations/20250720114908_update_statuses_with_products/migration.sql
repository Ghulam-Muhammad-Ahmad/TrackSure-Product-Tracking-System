-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`product_status_id`) REFERENCES `product_status`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
