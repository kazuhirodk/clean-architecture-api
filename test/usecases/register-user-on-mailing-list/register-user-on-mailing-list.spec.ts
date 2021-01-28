import { UserData } from '../../../src/entities'
import { UserRepository } from '../../../src/usecases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '../../../src/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name: string = 'any_name'
    const email: string = 'any@email.com'
    const response = await usecase.perform({ name, email })
    const user = await repo.findUserByEmail(email)

    expect(user.name).toBe(name)
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name: string = 'any_name'
    const invalidEmail: string = 'invalid_email'
    const response = (await usecase.perform({ name, email: invalidEmail })).value as Error
    const user = await repo.findUserByEmail(invalidEmail)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName: string = ''
    const email: string = 'any@email.com'
    const response = (await usecase.perform({ name: invalidName, email })).value as Error
    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})
