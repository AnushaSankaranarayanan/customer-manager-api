const customerController = require('./customer.controller')
const Customer = require('../models/customer.model')
jest.mock('../models/customer.model')

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
};

const mockRequest = () => {
  const req = {}
  req.params = jest.fn().mockReturnValue(req)
  return req
};

describe('Customer controller tests', () => {

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetModules()
  })

  test('Create Customer - invalid request body - failure', async () => {
    const data = {}
    jest.spyOn(Customer.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve(data))
    const req = mockRequest()
    const res = mockResponse()
    await customerController.create(req, res)
    expect(res.status).toBeCalledWith(400)
  })



  test('Create Customer - Success', async () => {
    const data = {}
    const spy = jest.spyOn(Customer.prototype, 'save')
      .mockImplementationOnce(() => Promise.resolve(data))
    const validReq = mockRequest()
    validReq.body = {
      name: 'testname',
      surname: 'test surname',
      email: 'test@example.com',
      initials: 't',
      mobile: '01234567'
    }
    const res = mockResponse()
    await customerController.create(validReq, res)
    expect(spy).toHaveBeenCalled()
    expect(res.status).toBeCalledWith(201)
  })

})

