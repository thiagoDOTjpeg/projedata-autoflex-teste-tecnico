INSERT INTO raw_materials (name, stock_quantity) VALUES ('Steel Plate', 50.0);
INSERT INTO raw_materials (name, stock_quantity) VALUES ('Electronic Component', 100.0);
INSERT INTO raw_materials (name, stock_quantity) VALUES ('Industrial Plastic', 80.0);

INSERT INTO products (name, price) VALUES ('Industrial Robot Arm', 15000.00);
INSERT INTO products (name, price) VALUES ('Control Panel', 2500.00);
INSERT INTO products (name, price) VALUES ('Sensor Case', 150.00);

INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (1, 1, 10.0);
INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (1, 2, 20.0);

INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (2, 1, 2.0);
INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (2, 2, 5.0);
INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (2, 3, 5.0);

INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (3, 2, 1.0);
INSERT INTO product_materials (product_id, material_id, required_quantity)
VALUES (3, 3, 2.0);

COMMIT;