const customerController = require('../controllers/customer.controller')

const postSpy = jest.fn()
const putSpy = jest.fn()
const getSpy = jest.fn()
const deleteSpy = jest.fn()


jest.doMock('express', () => {
    return {
        Router() {
            return {
                get: getSpy,
                post: postSpy,
                put: putSpy,
                delete: deleteSpy,
            }
        }
    }
})

describe('Should Test Customer Router', () => {
    require('./customer.routes')
    test('test customer routes', () => {
        expect(getSpy).toHaveBeenCalledWith('/customer/:customerId', customerController.findOne)
        expect(getSpy).toHaveBeenCalledWith('/customer', customerController.findAll)
        expect(postSpy).toHaveBeenCalledWith('/customer', customerController.create)
        expect(putSpy).toHaveBeenCalledWith('/customer/:customerId', customerController.update)
        expect(deleteSpy).toHaveBeenCalledWith('/customer/:customerId', customerController.delete)
    })
})