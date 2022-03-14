import config from 'config';
import app from './src/app';

const PORT:number = config.get<number>('port');

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
})