


export const testFunction = async (req, res) => {
    try {

       
       


        res.status(200).json(
            {
                msg:"this is working"
            },
        );


    }
    catch (err) {
        res.status(404).json({ error: err.message })
    }
}