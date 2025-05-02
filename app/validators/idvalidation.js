const idValidationSchema={
    id:{
        in:['params'],
        isMongoId:{errorMessage:'please provide valid mongoid'}
    }
}
export default idValidationSchema