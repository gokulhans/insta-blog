var express = require('express');
var router = express.Router();
var db = require('../connection')
var ObjectId = require('mongodb').ObjectId
var fun = require('../functions')
const iwa = require('instagram-without-api-node');






router.post('/newblog', async function (req, res) {
    let blogdata = req.body
    console.log('posted');
    if (!blogdata.img) {
        blogdata.img = 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?cs=srgb&dl=pexels-asad-photo-maldives-3293148.jpg&fm=jpg'
    }
    db.get().collection('blogs').insertOne(blogdata)
    let resp = { blogdata: blogdata }
    res.json(resp)
});


router.post('/blog', async (req, res) => {
    console.log('call');
    let id = req.body.id
    let blogdata = await db.get().collection('blogss').findOne({ _id: ObjectId(id) })
    let resp = { blogdata: blogdata }
    // console.log(resp);
    res.json(resp)
})


router.post('/update', async (req, res) => {
    console.log(req.body);
    let obj = { _id: ObjectId(req.body.id) }
    if (req.body.password) {

        var query = {
            $set: {
                username: req.body.username, gmail: req.body.gmail, password: req.body.password, img: req.body.img
            }
        }
    } else {

        var query = {
            $set: {
                username: req.body.username, gmail: req.body.gmail, img: req.body.img
            }
        }

    }

    db.get().collection('users').updateOne(obj, query).then((resp) => {
        console.log(resp);

        res.json(resp)
    })

})

router.post('/editblog', async (req, res) => {
    console.log(req.body);
    let obj = { _id: ObjectId(req.body.id) }

    var query = {
        $set: {
            title: req.body.title, blog: req.body.blog, img: req.body.img
        }
    }

    db.get().collection('blogs').updateOne(obj, query).then((resp) => {
        console.log(resp);
        resp.blog = req.body

        res.json(resp)
    })

})


router.get('/blogs/delete:id', async (req, res) => {
    let id = req.params.id
    db.get().collection('blogs').deleteOne({ _id: ObjectId(id) }).then((resp) => {
        console.log(resp);
        res.json(resp)
    })
})

router.get('/blogs', async (req, res) => {
    let blogs = await db.get().collection('blogss').find({}).toArray()
    // console.log(blogs);
    res.json(blogs)
})

router.get('/dev', async (req, res) => {
    console.log('successfully deleted');
    db.get().collection('blogs').remove({})
    db.get().collection('users').remove({})
    res.json('success')
})

router.get('/myblogs:id', async (req, res) => {
    let blogs = await db.get().collection('blogs').find({ userid: req.params.id }).toArray()
    res.json(blogs)
})














// var fun = require('../functions')
// var ObjectId = require('mongodb').ObjectId


// /* GET users listing. */
// // const requiredlogin = (req,res)=>{
// //   if (req.session.user) {
// //       req.session.userstatus = true
// //   }else{
// //     req.session.userstatus = false
// //   }
// // }
// router.get('/', async function (req, res) {
//   if (req.session.loggedIN) {
//     let id = req.session.user
//     let user =  await db.get().collection('users').findOne({ _id: ObjectId(id) })
//     let blogs = await db.get().collection('blogs').find().toArray()
//     let newblog = blogs[0]
//     res.render('index', { blogs,user,newblog });
//   } else {
//     res.redirect('/')
//   }

// });


// router.get('/signup', (req, res) => {

//   if (req.session.signupstatusfalse) {
//     res.render('signup', { err: true })
//   } else
//     res.render('signup')
// })

// router.get('/blog/:id', async (req, res) => {
//   let id = req.params.id
//   let user =  await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   let blog = await db.get().collection('blogs').findOne({ _id: ObjectId(id) })
//   let blogs = await db.get().collection('blogs').find().toArray()
//   res.render('blog', { blogs,user,blog })
// })

router.post('/signup', async (req, res) => {
    console.log('signup');
    fun.doSignup(req.body).then(async (response) => {
        console.log('post');
        if (response.signupstatus) {
            response.loggedIN = true
            // console.log(response);
            res.json(response)
            let insta = await fetch(username = response.user.username)
            // console.log(insta);
            // for (let i = 0; i < insta.length; i++) {
            // }

            insta.data.forEach(async element => {
                let newobj = {
                    title: element.text.slice(0, 40) + '...',
                    blog: element.text,
                    img: element.image,
                    userid: response.user._id,
                    author: response.user.username,
                }
                await db.get().collection('blogss').insertOne(newobj)
            });
            //
            // db.get().collection('demoinstadata').insertOne(insta).then((response) => {
            //     console.log("new response");
            //     console.log(response);
            // })
        } else {
            response.loggedIN = false
            res.json(response)
        }
    })

    // let demodata = await db.get().collection('demoinsta').find().toArray();
    // res.json(demodata);
})

// router.get('/login', function (req, res) {
//   console.log(req.session);
//   if (req.session.loggedIN) {
//     res.redirect('/users/')
//   }
//   if (req.session.loggedfalse) {
//     res.render('login', { err: true });
//   } else {
//     res.render('login');
//   }
// });

router.post('/login', (req, res) => {
    fun.doLogin(req.body).then((response) => {
        if (response.loginstatus) {
            response.loggedIN = true
            res.json(response)
        } else {
            response.loggedIN = false
            res.json(response)
        }
    })
})

// router.get('/logout', function (req, res) {
//   req.session.destroy()
//   res.redirect('/');
// });


// router.get('/myprofile', async function (req, res) {
//   let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   let blogs = await db.get().collection('blogs').find({ "userid": req.session.user }).toArray()
//   res.render('profile', { user, blogs })
// });



// router.get('/profile/:id', async function (req, res) {
//   let userid = req.params.id
//   let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   let bloguser = await db.get().collection('users').findOne({ _id: ObjectId(userid) })
//   let blogs = await db.get().collection('blogs').find({ "userid": userid }).toArray()
//   res.render('userprofile', { blogs, bloguser,user })
// });


// router.get('/newblog', async function (req, res) {
//   let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   res.render('newblog', { user })
// });

// router.post('/newblog', async function (req, res) {
//   let blogdata = req.body
//   if (!blogdata.imgurl) {
//     blogdata.imgurl = 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?cs=srgb&dl=pexels-asad-photo-maldives-3293148.jpg&fm=jpg'
//   }
//   db.get().collection('blogs').insertOne(blogdata).then((response)=>{
//     console.log(response.insertedId);
//     let blog =blogdata;
//     let user = db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//     res.render('blog',{blog,user})
//   })
// });

// router.post('/search', async function (req, res) {
//   console.log(req.body);
// });


// router.get('/edit/:id', async function (req, res) {
//   let blogid = req.params.id
//   let user = await db.get().collection('users').findOne({ _id: ObjectId(req.session.user) })
//   let blog = await db.get().collection('blogs').findOne({ _id: ObjectId(blogid) })
//   res.render('newblog', { user,blog })
// });
// router.post('/edit/', async function (req, res) {
//   console.log(req.body);
//   let blogdata = req.body
//   if (!blogdata.imgurl) {
//   }
//   // fun.imgUpload(blogdata).then((response)=>{ //for cloudinary 
//   // })

//   let blogid = blogdata.blogid
//   console.log(blogid);
//   let myquery = {_id:ObjectId(blogid)}
//   let newvalues = { $set: {"name":req.body.name,"title":req.body.title,"blog":req.body.blog,"imgurl":blogdata.imgurl,"section":req.body.section}}
//   db.get().collection('blogs').updateOne(myquery,newvalues).then((resp)=>{
//     console.log(resp);
//   })
//   res.redirect('/users/myprofile')

// });


// router.get('/delete/:id', (req, res) => {
//   id = req.params.id
//   db.get().collection('blogs').deleteOne({ _id: ObjectId(id) })
//   res.redirect('/users/')
// })

// router.post('/dp', function (req, res) {
//   dp = req.files
//   console.log(dp);
//   res.redirect('/');
// });

// router.post('/updateprofile/:id', async function (req, res) {
//   let id = req.params.id
//   let myquery = {_id:ObjectId(id)}
//   let newvalues = { $set: {"about":req.body.about,"name":req.body.name}}
//   db.get().collection('users').updateOne(myquery,newvalues)
//   res.redirect('/users/myprofile')
// });


const _cookie = 'mid=Yu09hQALAAEfWQOWV5aIgGfjOnTK; ig_did=75731793-3894-4891-A2EA-B46FFAA0D335; ig_nrcb=1; shbid="10563\05422376253183\0541691252012:01f7bcfc33874b908de1d932c8e260d676a4e211b85c29e03df52e2c7c5b31b25beb3c16"; shbts="1659716012\05422376253183\0541691252012:01f71a5dc5b63b6d5cbb07a7ffc1959bdc3d4a461e003ccad17cbd33b8b0c13aeadf3202"; datr=w0HtYj8MtDKpcY66qJe_M-IU; csrftoken=5M9cZ3pdXULZN06BS11CGMkURW7GMJpl; ds_user_id=22376253183; sessionid=22376253183%3AlthvAdU2JL15t3%3A0%3AAYfcVe9hE3PiTrsS-JPZKjzleuo0kmaQxTIramzGvQ; rur="NAO\05422376253183\0541691290400:01f78e8f6b38ebab3dcd02a08839ef5afe07f8fa8840d8ba86de0851316c8d1c58017250"'      // <!-- required!! please get your cookie from your browser console (6)
const _userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0'      // <!-- required!! please get your user-agent from your browser console (7)
const _xIgAppId = '936619743392459'                 // <!-- required!! please get your x-ig-app-id from your browser console (8)

async function fetch(username) {

    // fs.unlink('instagram-cache.json', function (err) {
    //     if (err) {
    //         console.log('\n \n \n file deletion err \n \n \n ');
    //         throw err;
    //     }
    //     // if no error, file has been deleted successfully
    //     console.log('File deleted!');
    // });

    let instausername = "g_k__h"
    const instaid = username;
    const response = await iwa.iwa({
        headers: {
            'cookie': _cookie,
            'user-agent': _userAgent,
            'x-ig-app-id': _xIgAppId
        },
        base64images: true,                     // <!-- optional, but without it, you will be not able to store/show images
        maxImages: 12,                           // <!-- optional, 12 is the max number
        file: "instagram-cache.json",           // <!-- optional, instagram-cache.json is by default
        pretty: true,                           // <!-- optional, prettyfy json true/false
        time: 3600,                             // <!-- optional, reload contents after 3600 seconds by default
        id: instaid                     // <!-- id is required
    })
    let insta = { data: response };
    return insta;
}


module.exports = router;