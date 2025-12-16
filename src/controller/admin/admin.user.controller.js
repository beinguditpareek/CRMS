const { StatusCodes } = require('http-status-codes')

const adminUserFn =  async (req,res)=>{
        try {
            return res.status(StatusCodes.OK).json({
                message:'api run successfully'
            })
        } catch (error) {
             return res.status(StatusCodes.OK).json({
                message:'api hit error',
                error:error.message
            })
        }
    }





module.exports={
adminUserFn
}