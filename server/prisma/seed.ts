import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.done@gmail.com',
        avatarUrl: 'https://github.com/FernandoLopesTI.png'
      }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exemple Pool',
      code: 'BOL123',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })
// console do navegador new Date().toISOString()
  await prisma.game.create({
    data:{
      date: '2022-11-08T12:00:00.931Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    
    }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-07T12:00:00.931Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId:{
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })

}

main()