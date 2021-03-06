const campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {
    const campgrounds = await  campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const {id, reviewId} = req.params;
    await campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted Review');
    res.redirect(`/campgrounds/${id}`);
}