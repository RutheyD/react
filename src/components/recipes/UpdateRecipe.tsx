import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { array, object, string } from "yup"
import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import recipeStore, { RecipeType } from "../store/recipeStore"
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import { IdContext } from "../AppLayout"
const style = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, background: "white", border: '3px solidrgb(103, 39, 107) ', boxShadow: 24, borderRadius: '16px', p: 4, overflowY: 'auto', maxHeight: '80vh',
};
const schema = object({
    title: string().required('Title is required'),
    description: string().required().min(10, 'Description nust be 10 letters'),
    ingredients: array()
        .of(string().required('Each product is required'))
        .min(1, 'At least one product is required'),
    instructions: string().required('Instructions are required'),
})
const UpdateRecipe = observer(({ recipeToUpdate }: { recipeToUpdate: RecipeType }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [id] = useContext(IdContext)
    const onSubmit: SubmitHandler<Partial<RecipeType>> = async (data) => {
        if (id)
            recipeStore.updateRecipe(data, +recipeToUpdate.id)
        handleClose()
        reset({ ingredients: [] })
    }
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors } } = useForm({
            resolver: yupResolver(schema), defaultValues: {
                title: recipeToUpdate.title,
                instructions: recipeToUpdate.instructions,
                description: recipeToUpdate.description,
                ingredients: recipeToUpdate.ingredients || ["", "", ""]
            }
        })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients"
    });
    useEffect(() => {
        if (recipeToUpdate) {
            setOpen(true);
        }
    }, [recipeToUpdate]);
    useEffect(() => {
        reset({
            title: recipeToUpdate.title,
            instructions: recipeToUpdate.instructions,
            description: recipeToUpdate.description,
            ingredients: recipeToUpdate.ingredients || ["", "", ""]
        });
    }, [recipeToUpdate, reset]);
    return (<>
        {open && <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description" >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField {...register('title')} type="text" fullWidth label="title" variant="outlined"sx={{margin:'3px'}} error={!!errors.title} helperText={errors.title?.message} />
                        <TextField {...register('description')} type="text" fullWidth label="description" variant="outlined"sx={{margin:'3px'}} error={!!errors.description} helperText={errors.description?.message} />
                        <Typography variant="subtitle1" sx={{ mt: 2 }} >Ingredients: </Typography>
                        {fields.map((field, index) => (
                            <div key={field.id}>
                                <TextField
                                    {...register(`ingredients.${index}`)}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    label={`Ingredient ${index + 1}`} />
                                <Button onClick={() => remove(index)}>Remove</Button>
                            </div>))}
                        <Button
                         sx={{margin:'3px'}}
                            onClick={() => append('')}
                            variant="outlined"
                            startIcon={<AddIcon />}>
                            Add Product
                        </Button>
                        <TextField {...register('instructions')} type="text" fullWidth label="instructions" variant="outlined" multiline sx={{margin:'3px'}} error={!!errors.instructions} helperText={errors.instructions?.message} />
                        <Button type='submit' variant="contained" endIcon={<SendIcon />} sx={{ backgroundColor: 'white', color: "rgb(14, 117, 148)", marginTop: '15px', '&:hover': { backgroundColor: '#f5f5f5', }, }}
                        >Send</Button>
                    </form>
                </Typography>
            </Box>
        </Modal>}
    </>)
})
export default UpdateRecipe