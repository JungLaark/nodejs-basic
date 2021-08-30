// 시스템 내장 이벤트 --> 프로세스가 종료하는 시점
process.on('exit', function() {
	console.log('exit 이벤트 발생함.');
});

// 사용자 정의 이벤트
process.on('onTick', function(a, b) {
	console.log('tick 이벤트 발생함 : %s %s', a, b);
});

// 지정된 시간동안 대기 후, 콜백함수를 실행.
setTimeout(function() {  
	console.log('2초 후에 tick 이벤트 전달 시도함.');
	process.emit('onTick', "Hello", "World");	// 이벤트 발생
}, 2000);

console.log("-------- 프로그램 흐름 종료 ---------");