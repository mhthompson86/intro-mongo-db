const mongoose = require('mongoose');

const connect = () => {
  return mongoose.connect('mongodb://localhost:27017/whatever',
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
};

const school = new mongoose.Schema({
  name: {
    type: String,
    unique: false
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'district'
  },
  openSince: Number,
  students: Number,
  isGreat: Boolean,
  staff: [{ type: String }]
});


school.index({
  district: 1,
  name: 1
}, { unique: true });


school.pre('save', function () {
  console.log('before save');
});

school.post('save', function (doc, next) {
  console.log('wait 1 second...');
  setTimeout(() => {
    next();
  }, 1000);
});

school.post('save', function (doc) {
  console.log('after save:', doc);
});

school.virtual('staffCount')
  .get(function () {
    return this.staff.length;
  });

const School = mongoose.model('school', school);


connect()
  .then(async connection => {

    const mySchool = await School.create({
      name: 'Burke County High',
      openSince: 1986,
      students: 1200,
      isGreat: true,
      staff: ['a', 'b', 'c']
    });

    console.log('count:', mySchool.staffCount);


    return mongoose.disconnect();
  })
  .catch(e => console.error(e));


/*
const student = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true
  },
  faveFoods: [{ type: String }],
  info: {
    school: {
      type: String
    }
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'school'
  }
}, { timestamps: true });

const school = new mongoose.Schema({
  name: String,
  openSince: Number,
  students: Number,
  isGreat: Boolean,
  staff: [{ type: String }]
});

const Student = mongoose.model('student', student);
const School = mongoose.model('school', school);


connect()
  .then(async connection => {
    //const student = await Student.create({ firstName: 'MacGregor' });
    // const found = Student.find({ firstName: 'thi' });
    // const foundById = Student.findById('asdfasdf');
    // const updated = Student.findByIdAndUpdate('sdfasdf', { firstName: 'Bob' });
    // console.log(student);


    const school1 = {
      name: 'Burke County High',
      openSince: 1986,
      students: 1200,
      isGreat: true,
      staff: ['a', 'b', 'c']
    };

    const school2 = {
      name: 'Richmond Academy',
      openSince: 1980,
      students: 600,
      isGreat: false,
      staff: ['m', 'b', 'l']
    };

    const schools = await School.create([school1, school2]);

    const match = await School.find({
      //students: {$lt: 650}
       staff: 'b'
      //$in: { staff: ['a', 'm'] }
    })
      .sort({openSince: -1})
      //.limit(2)
      .exec();

    console.log('match:', match);

//const school = await School.create({ name: 'Burke County High' });
    const school = await School.findOneAndUpdate(
      { name: 'Burke County High' },
      { name: 'Burke County High' },
      { upsert: true, new: true }
    ).exec();
    const student = await Student.create({ firstName: 'MacGregor', lastName: 'Thompson', school: school._id });
    const student2 = await Student.create({ firstName: 'Kristin', lastName: 'Thompson', school: school._id });
    const student3 = await Student.create({ firstName: 'Jackson', lastName: 'Thompson', school: school._id });

//const match = await Student.findById(student._id)
    const match2 = await Student.findOne({ firstName: 'Jackson' })
      .populate('school').exec();  // populate will stitch the school data inside the student

//console.log('match2:', match2);

    return mongoose.disconnect();
  })
  .catch(e => console.error(e));

*/
