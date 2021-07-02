const campground = require('../models/campground');
module.exports.index = async (req,res) => {
    const campgrounds= await campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res) => {
    const Campground= new campground(req.body.campground);
    Campground.author = req.user._id;
    await Campground.save();
    req.flash('success', 'Successfully made new Campground!');
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.showCampground = async (req,res) => {
    const campgrounds = await campground.findById(req.params.id).populate({path:'reviews',
    populate:{
        path:'author'
    }}).populate('author');
    if(!campgrounds){
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{ campgrounds });
} 

module.exports.renderEditForm = async (req,res) => {
    const campgrounds = await campground.findById(req.params.id);
     if(!campgrounds){
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/edit',{ campgrounds });
}

module.exports.updateCampground =  async (req,res) => {
    const {id} = req.params;
    const Campground = await campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success', 'Successfully update Campground!');
    res.redirect(`/campgrounds/${Campground._id}`)

}


module.exports.deleteCampground = async (req,res) => {
    const {id} =req.params;
     await campground.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted Campground!');
     res.redirect('/campgrounds')
}