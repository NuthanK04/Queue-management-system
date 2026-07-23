import prisma from "../config/prisma";

export class QueueRepository {
  async create(data: {
    name: string;
    description?: string;
    managerId: string;
  }) {
    return prisma.queue.create({
      data,
    });
  }

  async findByManager(managerId: string) {
    return prisma.queue.findMany({
      where: {
        managerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.queue.findUnique({
      where: {
        id,
      },
      include: {
        tokens: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.queue.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.queue.delete({
      where: {
        id,
      },
    });
  }
}