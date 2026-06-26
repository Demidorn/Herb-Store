const prisma = require('../config/database');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/imageService');

// Get all herbs with filtering and pagination
exports.getHerbs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search, 
      tag, 
      family 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { scientificName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (family) {
      where.family = family;
    }

    const [herbs, total] = await Promise.all([
      prisma.herb.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          images: {
            orderBy: { createdAt: 'asc' },
            take: 3, // Get first 3 images for preview
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.herb.count({ where }),
    ]);

    res.json({
      herbs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single herb by ID
exports.getHerbById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const herb = await prisma.herb.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }

    res.json(herb);
  } catch (error) {
    next(error);
  }
};

// Create new herb
exports.createHerb = async (req, res, next) => {
  try {
    const {
      name,
      scientificName,
      family,
      description,
      uses,
      growing,
      care,
      tags,
    } = req.body;

    const herb = await prisma.herb.create({
      data: {
        name,
        scientificName,
        family,
        description,
        uses: JSON.parse(uses || '{}'),
        growing: JSON.parse(growing || '{}'),
        care: JSON.parse(care || '{}'),
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      },
    });

    res.status(201).json(herb);
  } catch (error) {
    next(error);
  }
};

// Update herb
exports.updateHerb = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse JSON fields
    if (updateData.uses) updateData.uses = JSON.parse(updateData.uses);
    if (updateData.growing) updateData.growing = JSON.parse(updateData.growing);
    if (updateData.care) updateData.care = JSON.parse(updateData.care);
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const herb = await prisma.herb.update({
      where: { id },
      data: updateData,
    });

    res.json(herb);
  } catch (error) {
    next(error);
  }
};

// Delete herb
exports.deleteHerb = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete all images from Cloudinary
    const herb = await prisma.herb.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }

    await Promise.all(
      herb.images.map((img) => deleteFromCloudinary(img.publicId))
    );

    await prisma.herb.delete({
      where: { id },
    });

    res.json({ message: 'Herb deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Upload images for herb
exports.uploadImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caption, type = 'plant' } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const herb = await prisma.herb.findUnique({
      where: { id },
    });

    if (!herb) {
      return res.status(404).json({ error: 'Herb not found' });
    }

    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, `${id}`)
    );

    const uploadResults = await Promise.all(uploadPromises);

    const images = await Promise.all(
      uploadResults.map((result, index) =>
        prisma.image.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            caption: Array.isArray(caption) ? caption[index] : caption,
            type,
            herbId: id,
          },
        })
      )
    );

    res.status(201).json(images);
  } catch (error) {
    next(error);
  }
};

// Delete specific image
exports.deleteImage = async (req, res, next) => {
  try {
    const { herbId, imageId } = req.params;

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await deleteFromCloudinary(image.publicId);
    await prisma.image.delete({
      where: { id: imageId },
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};