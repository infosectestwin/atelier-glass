INSERT INTO designs (category_slug, slot_number, name, description, materials, image_url)
VALUES
  ('collections', 1, 'Collection Piece 1', 'An original piece from the Collections line.', 'To be updated', NULL),
  ('collections', 2, 'Collection Piece 2', 'An original piece from the Collections line.', 'To be updated', NULL),
  ('collections', 3, 'Collection Piece 3', 'An original piece from the Collections line.', 'To be updated', NULL),
  ('collections', 4, 'Collection Piece 4', 'An original piece from the Collections line.', 'To be updated', NULL),
  ('couture-lab', 1, 'Couture Lab Piece 1', 'An experimental piece from the Couture Lab.', 'To be updated', NULL),
  ('couture-lab', 2, 'Couture Lab Piece 2', 'An experimental piece from the Couture Lab.', 'To be updated', NULL),
  ('couture-lab', 3, 'Couture Lab Piece 3', 'An experimental piece from the Couture Lab.', 'To be updated', NULL),
  ('couture-lab', 4, 'Couture Lab Piece 4', 'An experimental piece from the Couture Lab.', 'To be updated', NULL),
  ('material-studies', 1, 'Material Studies 1', 'A material exploration piece.', 'To be updated', NULL),
  ('material-studies', 2, 'Material Studies 2', 'A material exploration piece.', 'To be updated', NULL),
  ('material-studies', 3, 'Material Studies 3', 'A material exploration piece.', 'To be updated', NULL),
  ('material-studies', 4, 'Material Studies 4', 'A material exploration piece.', 'To be updated', NULL),
  ('archive', 1, 'Archive Piece 1', 'A piece from the Archive.', 'To be updated', NULL),
  ('archive', 2, 'Archive Piece 2', 'A piece from the Archive.', 'To be updated', NULL),
  ('archive', 3, 'Archive Piece 3', 'A piece from the Archive.', 'To be updated', NULL),
  ('archive', 4, 'Archive Piece 4', 'A piece from the Archive.', 'To be updated', NULL)
ON CONFLICT (category_slug, slot_number) DO NOTHING;
