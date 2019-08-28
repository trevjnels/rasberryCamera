var cmd = require('node-cmd');

// cmd.get(`raspistill -o storage/${Date.now()}.jpg`, (err, data, stderr) => {
// 	if (err) {
// 		console.log('error');
// 		console.log(err);
// 	} else {
// 		console.log('i think we suceeded');
// 	}
// });
//command takes a picture and titles it as the Date.now()

const recorder = (callback) => {
	console.log('starting new recording.......................................');
	cmd.get(`raspivid -o storage/${Date.now()}.h264 -t 900000`, (err, data, stderr) => {
		if (err) {
			console.log('error');
			console.log(err);
			callback();
		} else {
			console.log('15 min video recording in complete');
			callback();
		}
	});
};

const storageCheck = () => {
	console.log('checking storage now)');
	cmd.get(`du -sh storage/`, (err, data, stderr) => {
		if (err) {
			console.log('error');
			console.log(err);
		} else {
			var storage = data.split('	')[0];
			var length = storage.length;
			if (storage[length - 1] === 'M') {
				var megs = parseInt(storage.slice(0, -1));
				console.log('just dealing with megabigts here', megs);
			} else {
				var gigs = parseInt(storage.slice(0, -1));
				if (gigs > 14) {
					console.log('getting fullish');
					cmd.get(
						`find /home/hefty/storage -type f -printf '%T+ %p\n' | sort | head -n 1`,
						(err, oldestFile, stderr) => {
							cmd.get(`rm -r ${oldestFile}`, (e, o, s) => {
								console.log('removed ', oldestFile);
							});
						}
					);
				}
			}
			console.log('------------------------------------');
			console.log(storage);
			console.log('------------------------------------');
			console.log('data is : ', data);
		}
	});
};
recorder(storageCheck);
setInterval(() => {
	recorder(storageCheck);
}, 900000);

// cmd.get(`find /home/hefty/storage -type f -printf '%T+ %p\n' | sort | head -n 1`, (err, oldestFile, stderr) => {
// 	cmd.get(`rm -r ${oldestFile}`);
// 	console.log('removed ', oldestFile);
// });
