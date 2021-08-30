// EventEmiter를 사용하여 직접 정의한 객체가 이벤트를 갖도록 구현하기

/* (1) 모듈 가져오기 */
var events = require('events'); //내장 모듈  EventEmiter 모듈 참조

/* (2) 클래스 정의하기 */
class Radio extends events.EventEmitter {
	// (3)에서 클래스의 상속이 이루어 졌으므로 
	// 생성자에서 상위 클래스의 생성자를 호출하도록 지정. --> 상속구현
	// new 키워드에 의해서 호출되기 전까지 생성자는 실행되지 않는다.
	constructor(){
		//events.EventEmitter.call(this);
		super();
	}
};

/* (3) 클래스의 상속처리 --> util.inherits(자식클래스, 부모클래스) */
//util.inherits(Radio, events.EventEmitter);  //emtter에서 radio로 상속됨 
//위에거는 삭제 해도됨 
/* (4) 직접 정의한 클래스에 대한 객체 */
var radio = new Radio();

/* (5) 이벤트 수 설정하기 */
/*----------------------------------------------------------
 | 	emitter.setMaxListeners(n)
 |	해당 eventEmitter에 바인딩될 수 있는 이벤트의 수를 조정한다.
 |	기본값 10개
 -----------------------------------------------------------*/
radio.setMaxListeners(5);

/* (6) 이벤트 리스너 정의하기 --> 이벤트 이름은 사용자가 직접 정의 */
/*----------------------------------------------------------
 |	emitter.on('eventname','listener function')
 |	emitter.addListener('eventname','listener function')
 |----------------------------------------------------------
 |	"eventname"에 해당하는 이벤트에 대해서 
 |	'listener function' 이름의 함수가 매번 호출 되도록 한다. 
 |	이벤트에 함수를 binding 할때는 하나의 이벤트에 여러 개의 
 |	listener를 바인딩 할 수 있으며, 
 |	최대 바인딩 개수는 디폴트 값은 10개이다.
 -----------------------------------------------------------*/
function onTurnOn(channel) {
	console.log('라디오가 켜졌습니다. 채널번호=' + channel);
}

radio.on('turnon', onTurnOn);

// 한 이벤트에 두 개 이상의 함수 설정 가능. --> 기본 최대 10개까지.
radio.on('turnon', function(channel){
	console.log('Hello Radio ' + channel);
});

// on과 같은 기능
radio.addListener('changechannel', function(channel){
	console.log('채널이 %d 번으로 변경되었습니다.', channel);
});


/* (7) 1회용 이벤트 */
/*----------------------------------------------------------
 | emitter.once('eventname','listener function')
 |		"eventname"에 해당하는 이벤트에 대해서 
 |		'listener function' 이름의 함수가 처음 한번만 호출 되도록 한다.
 -----------------------------------------------------------*/
radio.once('turnoff', function(channel) {
	console.log('라디오가 꺼졌습니다. 채널번호=' + channel);
});

/* (8) 이벤트 발생시키기 */
/*----------------------------------------------------------
 | 	emitter.emit('eventname',[args])
 |		"eventname"의 이벤트를 생성하고, 이벤트를 생성할 당시 
 |		[args]에 정의된 값 들을 이벤트와 함께 전달한다.
 -----------------------------------------------------------*/
for (var i=0; i<2; i++) {
	console.log("-------------------");
	radio.emit('turnon', i);
	radio.emit('changechannel', i);
	// once로 이벤트가 정의되었으므로 한번만 실행된다.
	radio.emit('turnoff', i);
	console.log("-------------------");
}

/* (9) 이벤트 제거하기 */
/*----------------------------------------------------------
 |	emitter.removeListener('eventname','listener function')
 |		"eventname"에 바인딩 되어 있는 "listener function"
 |		이름의 함수와의 binding을 제거한다.
 |		익명 함수 방식이 아닌, 별도로 이름을 갖는 함수를
 |		정의해야만 한다.
 -----------------------------------------------------------*/
radio.removeListener('turnon', onTurnOn);
// 제거결과 확인하기
radio.emit('turnon', 1000);