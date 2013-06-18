﻿(function() {
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.ApplicationBase.ApplicationPage
	var $MorseCode_$CsJs_UI_ApplicationBase$ApplicationPage = function(createPage, bind) {
		this.$_createPage = null;
		this.$_bind = null;
		this.$_createPage = createPage;
		this.$_bind = bind;
	};
	$MorseCode_$CsJs_UI_ApplicationBase$ApplicationPage.prototype = {
		get_$createPage: function() {
			return this.$_createPage;
		},
		get_$bind: function() {
			return this.$_bind;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.TextBox.ITextBoxTextBinding
	var $MorseCode_$CsJs_UI_Controls_TextBox$ITextBoxTextBinding = function() {
	};
	$MorseCode_$CsJs_UI_Controls_TextBox$ITextBoxTextBinding.prototype = { get_$updateWhileChanging: null, set_$updateWhileChanging: null };
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.TextBox.TextBoxTextBinding
	var $MorseCode_$CsJs_UI_Controls_TextBox$TextBoxTextBinding$1 = function(T) {
		var $type = function(owner, getTextProperty, dataContext, bindToDataContext, unbindFromDataContext, updateWhileChanging) {
			this.$_owner = null;
			this.$_getTextProperty = null;
			this.$_updateWhileChanging = false;
			this.$_updateDataContextEventHandler = null;
			ss.makeGenericType($MorseCode_CsJs_UI_Binding$1, [T]).call(this, dataContext, bindToDataContext, unbindFromDataContext, null, null);
			this.$_owner = owner;
			this.$_updateWhileChanging = updateWhileChanging;
			this.$_getTextProperty = getTextProperty;
			this.set_bindToControl(this.$getBindToControl(updateWhileChanging));
			this.set_unbindFromControl(this.$getUnbindFromControl(updateWhileChanging));
		};
		$type.prototype = {
			$getBindToControl: function(updateWhileChanging) {
				return ss.mkdel(this, function(d) {
					this.$_updateDataContextEventHandler = ss.mkdel(this, function(sender, args) {
						this.$_getTextProperty(d).set_value$1(this.$_owner.get_text());
					});
					if (updateWhileChanging) {
						this.$_owner.add_textChanging(this.$_updateDataContextEventHandler);
					}
					else {
						this.$_owner.add_textChanged(this.$_updateDataContextEventHandler);
					}
				});
			},
			$getUnbindFromControl: function(updateWhileChanging) {
				return ss.mkdel(this, function(d) {
					if (updateWhileChanging) {
						this.$_owner.remove_textChanging(this.$_updateDataContextEventHandler);
					}
					else {
						this.$_owner.remove_textChanged(this.$_updateDataContextEventHandler);
					}
				});
			},
			get_$updateWhileChanging: function() {
				return this.$_updateWhileChanging;
			},
			set_$updateWhileChanging: function(value) {
				if (this.$_updateWhileChanging !== value) {
					this.$_updateWhileChanging = value;
					this.set_bindToControl(this.$getBindToControl(value));
					this.set_unbindFromControl(this.$getUnbindFromControl(value));
				}
			}
		};
		ss.registerGenericClassInstance($type, $MorseCode_$CsJs_UI_Controls_TextBox$TextBoxTextBinding$1, [T], function() {
			return ss.makeGenericType($MorseCode_CsJs_UI_Binding$1, [T]);
		}, function() {
			return [ss.IDisposable, $MorseCode_CsJs_UI_IBinding, $MorseCode_$CsJs_UI_Controls_TextBox$ITextBoxTextBinding];
		});
		return $type;
	};
	ss.registerGenericClass(null, 'MorseCode.$CsJs.UI.Controls.TextBox$TextBoxTextBinding$1', $MorseCode_$CsJs_UI_Controls_TextBox$TextBoxTextBinding$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.ApplicationBase
	var $MorseCode_CsJs_UI_ApplicationBase = function() {
		this.$_applicationPages = new (ss.makeGenericType(ss.Dictionary$2, [Function, $MorseCode_$CsJs_UI_ApplicationBase$ApplicationPage]))();
		this.$_pageRegistrationHelper = null;
		this.$_applicationViewModel = null;
		this.$_currentPage = null;
		this.$_applicationViewModel = new ss.Lazy(ss.mkdel(this, this.createApplicationViewModel));
		this.$_pageRegistrationHelper = new $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelper(this);
	};
	$MorseCode_CsJs_UI_ApplicationBase.prototype = {
		get_title: function() {
			return document.title;
		},
		set_title: function(value) {
			document.title = value;
		},
		createApplicationViewModel: null,
		initialize: function() {
			MorseCode.CsJs.Common.TimerFactory.set_instance($MorseCode_CsJs_UI_WindowTimerFactory.get_instance());
			this.registerPages(this.$_pageRegistrationHelper);
			window.onerror = this.$_applicationViewModel.value().get_errorHandler();
			this.$_applicationViewModel.value().get_currentViewModel().add_changed(ss.mkdel(this, this.$currentViewModelChanged));
			this.$_applicationViewModel.value().initialize();
		},
		$currentViewModelChanged: function(sender, e) {
			if (ss.isValue(this.$_currentPage)) {
				this.$_currentPage.dispose();
				this.$_currentPage = null;
			}
			var currentViewModel = this.$_applicationViewModel.value().get_currentViewModel().get_value();
			if (ss.isValue(currentViewModel)) {
				var currentViewModelType = ss.getInstanceType(currentViewModel);
				if (!this.$_applicationPages.containsKey(currentViewModelType)) {
					throw new ss.Exception('Could not find a page with view model type ' + ss.getTypeFullName(currentViewModelType) + '.');
				}
				var applicationPage = this.$_applicationPages.get_item(currentViewModelType);
				this.$_currentPage = applicationPage.get_$createPage()();
				this.set_title(this.$_currentPage.get_title());
				applicationPage.get_$bind()(this.$_currentPage, currentViewModel);
			}
		},
		registerPages: null
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.ApplicationBase.PageRegistrationHelper
	var $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelper = function(application) {
		this.$_application = null;
		this.$_application = application;
	};
	$MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelper.prototype = {
		registerPage: function(TPage) {
			return function(createPage) {
				return new (ss.makeGenericType($MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelperStep2$1, [TPage]))(this.$_application, createPage);
			};
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.ApplicationBase.PageRegistrationHelperStep2
	var $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelperStep2$1 = function(TPage) {
		var $type = function(application, createPage) {
			this.$_application = null;
			this.$_createPage = null;
			this.$_application = application;
			this.$_createPage = createPage;
		};
		$type.prototype = {
			withBinding: function(TDataContext) {
				return function(bind) {
					this.$_application.$_applicationPages.add(TDataContext, new $MorseCode_$CsJs_UI_ApplicationBase$ApplicationPage(this.$_createPage, function(p, d) {
						bind(ss.cast(p, TPage), ss.cast(d, TDataContext));
					}));
				};
			}
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelperStep2$1, [TPage], function() {
			return null;
		}, function() {
			return [];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.ApplicationBase$PageRegistrationHelperStep2$1', $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelperStep2$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Binding
	var $MorseCode_CsJs_UI_Binding$1 = function(T) {
		var $type = function(dataContext, bindToDataContext, unbindFromDataContext, bindToControl, unbindFromControl) {
			this.$_dataContext = null;
			this.$_bindToDataContext = null;
			this.$_unbindFromDataContext = null;
			this.$_bindToControl = null;
			this.$_unbindFromControl = null;
			this.$_dataContext = dataContext;
			this.$_bindToDataContext = bindToDataContext;
			this.$_unbindFromDataContext = unbindFromDataContext;
			this.$_bindToControl = bindToControl;
			this.$_unbindFromControl = unbindFromControl;
			this.$bindToDataContextInternal();
			this.$bindToControlInternal();
			this.$_dataContext.add_beforeChanged(ss.mkdel(this, this.$onBeforeDataContextChanged));
			this.$_dataContext.add_changed(ss.mkdel(this, this.$onDataContextChanged));
		};
		$type.prototype = {
			$onBeforeDataContextChanged: function(sender, e) {
				this.$unbindFromDataContextInternal();
				this.$unbindFromControlInternal();
			},
			$unbindFromDataContextInternal: function() {
				if (!ss.staticEquals(this.$_unbindFromDataContext, null)) {
					this.$_unbindFromDataContext(this.$_dataContext.get_value());
				}
			},
			$unbindFromControlInternal: function() {
				if (!ss.staticEquals(this.$_unbindFromControl, null)) {
					this.$_unbindFromControl(this.$_dataContext.get_value());
				}
			},
			$onDataContextChanged: function(sender, e) {
				this.$bindToDataContextInternal();
				this.$bindToControlInternal();
			},
			$bindToDataContextInternal: function() {
				if (!ss.staticEquals(this.$_bindToDataContext, null)) {
					this.$_bindToDataContext(this.$_dataContext.get_value());
				}
			},
			$bindToControlInternal: function() {
				if (!ss.staticEquals(this.$_bindToControl, null)) {
					this.$_bindToControl(this.$_dataContext.get_value());
				}
			},
			dispose: function() {
				this.$_dataContext.remove_beforeChanged(ss.mkdel(this, this.$onBeforeDataContextChanged));
				this.$_dataContext.remove_changed(ss.mkdel(this, this.$onDataContextChanged));
				this.$unbindFromDataContextInternal();
				this.$unbindFromControlInternal();
			},
			get_dataContext: function() {
				return this.$_dataContext;
			},
			set_dataContext: function(value) {
				if (!ss.referenceEquals(this.$_dataContext, value)) {
					this.$unbindFromDataContextInternal();
					this.$unbindFromControlInternal();
					this.$_dataContext = value;
					this.$bindToDataContextInternal();
					this.$bindToControlInternal();
				}
			},
			get_bindToDataContext: function() {
				return this.$_bindToDataContext;
			},
			set_bindToDataContext: function(value) {
				if (!ss.referenceEquals(this.$_bindToDataContext, value)) {
					this.$unbindFromDataContextInternal();
					this.$_bindToDataContext = value;
					this.$bindToDataContextInternal();
				}
			},
			get_unbindFromDataContext: function() {
				return this.$_unbindFromDataContext;
			},
			set_unbindFromDataContext: function(value) {
				this.$_unbindFromDataContext = value;
			},
			get_bindToControl: function() {
				return this.$_bindToControl;
			},
			set_bindToControl: function(value) {
				if (!ss.referenceEquals(this.$_bindToControl, value)) {
					this.$unbindFromControlInternal();
					this.$_bindToControl = value;
					this.$bindToControlInternal();
				}
			},
			get_unbindFromControl: function() {
				return this.$_unbindFromControl;
			},
			set_unbindFromControl: function(value) {
				this.$_unbindFromControl = value;
			}
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_Binding$1, [T], function() {
			return null;
		}, function() {
			return [ss.IDisposable, $MorseCode_CsJs_UI_IBinding];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.Binding$1', $MorseCode_CsJs_UI_Binding$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.IBinding
	var $MorseCode_CsJs_UI_IBinding = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Styles
	var $MorseCode_CsJs_UI_Styles = function() {
		this.$_styleDictionary = new (ss.makeGenericType(ss.Dictionary$2, [String, String]))();
		this.$_element = null;
	};
	$MorseCode_CsJs_UI_Styles.prototype = {
		get_item: function(name) {
			return this.get(name);
		},
		set_item: function(name, value) {
			this.addOrSet(name, value);
		},
		get: function(name) {
			var value = {};
			this.$_styleDictionary.tryGetValue(name, value);
			return value.$;
		},
		addOrSet: function(name, value) {
			if (this.$_styleDictionary.containsKey(name)) {
				this.$_styleDictionary.set_item(name, value);
				this.onStyleChanged(name, value);
			}
			else {
				this.$_styleDictionary.add(name, value);
				this.onStyleAdded(name, value);
			}
		},
		remove: function(name) {
			if (this.$_styleDictionary.remove(name)) {
				this.onStyleRemoved(name);
			}
		},
		onStyleChanged: function(name, value) {
			if (ss.isValue(this.$_element)) {
				this.$_element.style[name] = value;
			}
		},
		onStyleAdded: function(name, value) {
			if (ss.isValue(this.$_element)) {
				this.$_element.style[name] = value;
			}
		},
		onStyleRemoved: function(name) {
			if (ss.isValue(this.$_element)) {
				this.$_element.style[name] = '';
			}
		},
		getEnumerator: function() {
			return this.$_styleDictionary.getEnumerator();
		},
		attachToElement: function(element) {
			if (ss.isValue(this.$_element)) {
				this.detachFromElement(this.$_element, false);
			}
			this.$_element = element;
			$MorseCode_CsJs_UI_Styles.$clearElementStyles(this.$_element);
			var $t1 = this.getEnumerator();
			try {
				while ($t1.moveNext()) {
					var style = $t1.current();
					this.$_element.style[style.key] = style.value;
				}
			}
			finally {
				$t1.dispose();
			}
		},
		detachFromElement: function(element, clearElementStyles) {
			if (clearElementStyles) {
				$MorseCode_CsJs_UI_Styles.$clearElementStyles(this.$_element);
			}
			this.$_element = null;
		},
		$parseStyleString: function(value) {
			var styles = Enumerable.from(value.split(String.fromCharCode(59))).select(function(s) {
				return s.trim();
			});
			var $t1 = ss.getEnumerator(styles);
			try {
				while ($t1.moveNext()) {
					var style = $t1.current();
					if (ss.isNullOrEmptyString(style)) {
						continue;
					}
					var nameValuePair = Enumerable.from(style.split(String.fromCharCode(58))).select(function(s1) {
						return s1.trim();
					}).toArray();
					if (nameValuePair.length === 2) {
						this.set_item(nameValuePair[0], nameValuePair[1]);
					}
				}
			}
			finally {
				$t1.dispose();
			}
		}
	};
	$MorseCode_CsJs_UI_Styles.$clearElementStyles = function(element) {
		element.removeAttribute('style');
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.WindowTimer
	var $MorseCode_CsJs_UI_WindowTimer = function(callback, milliseconds, autoReset) {
		this.$_callback = null;
		this.$_milliseconds = 0;
		this.$_autoReset = false;
		this.$_timerId = new (ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableProperty$1, [ss.Nullable]))();
		this.$_isRunning = null;
		this.$_callback = callback;
		this.$_milliseconds = milliseconds;
		this.$_autoReset = autoReset;
		this.$_isRunning = ss.makeGenericType(MorseCode.CsJs.Common.Observable.CalculatedProperty$1, [Boolean]).create(ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableProperty$1, [ss.Nullable])).call(null, this.$_timerId, function(timerId) {
			return ss.Nullable.ne(timerId.get_value(), null);
		}, null);
	};
	$MorseCode_CsJs_UI_WindowTimer.prototype = {
		start: function() {
			this.$start(true);
		},
		startSafe: function() {
			this.$start(false);
		},
		$start: function(throwExceptionIfRunning) {
			if (ss.Nullable.ne(this.$_timerId.get_value(), null)) {
				if (throwExceptionIfRunning) {
					throw new ss.NotSupportedException('Timer is already running.');
				}
				return;
			}
			if (this.$_autoReset) {
				this.$_timerId.set_value$2(window.setInterval(this.$_callback, this.$_milliseconds));
			}
			else {
				this.$_timerId.set_value$2(window.setTimeout(ss.mkdel(this, function() {
					this.$_timerId.set_value$2(null);
					this.$_callback();
				}), this.$_milliseconds));
			}
		},
		stop: function() {
			this.$stop(true);
		},
		stopSafe: function() {
			this.$stop(false);
		},
		$stop: function(throwExceptionIfNotRunning) {
			if (ss.Nullable.eq(this.$_timerId.get_value(), null)) {
				if (throwExceptionIfNotRunning) {
					throw new ss.NotSupportedException('Timer is not running.');
				}
				return;
			}
			if (this.$_autoReset) {
				window.clearInterval(ss.Nullable.unbox(this.$_timerId.get_value()));
			}
			else {
				window.clearTimeout(ss.Nullable.unbox(this.$_timerId.get_value()));
			}
			this.$_timerId.set_value$2(null);
		},
		get_isRunning: function() {
			return this.$_isRunning;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.WindowTimerFactory
	var $MorseCode_CsJs_UI_WindowTimerFactory = function() {
	};
	$MorseCode_CsJs_UI_WindowTimerFactory.prototype = {
		createTimer: function(callback, milliseconds, autoReset) {
			return new $MorseCode_CsJs_UI_WindowTimer(callback, milliseconds, autoReset);
		}
	};
	$MorseCode_CsJs_UI_WindowTimerFactory.get_instance = function() {
		return $MorseCode_CsJs_UI_WindowTimerFactory.$instanceLazy.value();
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Button
	var $MorseCode_CsJs_UI_Controls_Button = function() {
		this.$_button = null;
		this.$_buttonJQuery = null;
		this.$2$ClickField = null;
		$MorseCode_CsJs_UI_Controls_ControlBase.call(this);
	};
	$MorseCode_CsJs_UI_Controls_Button.prototype = {
		createElements: function() {
			this.$_button = document.createElement('button');
			this.$_buttonJQuery = $(this.$_button);
			this.$_buttonJQuery.click(ss.mkdel(this, function(e) {
				this.onClick();
			}));
		},
		getRootElements: function() {
			return [this.$_button];
		},
		get_text: function() {
			this.ensureElementsCreated();
			return this.$_button.innerText;
		},
		set_text: function(value) {
			this.ensureElementsCreated();
			this.$_button.innerText = value;
		},
		get_visible: function() {
			return this.$_buttonJQuery.is(':visible');
		},
		set_visible: function(value) {
			this.$_button.style.display = (value ? '' : 'none');
		},
		add_click: function(value) {
			this.$2$ClickField = ss.delegateCombine(this.$2$ClickField, value);
		},
		remove_click: function(value) {
			this.$2$ClickField = ss.delegateRemove(this.$2$ClickField, value);
		},
		onClick: function() {
			if (!ss.staticEquals(this.$2$ClickField, null)) {
				this.$2$ClickField(this, ss.EventArgs.Empty);
			}
		},
		bindClickAction: function(T) {
			return function(dataContext, getClickAction) {
				var updateDataContextEventHandler = null;
				this.createOneWayToSourceBinding(T).call(this, dataContext, ss.mkdel(this, function(d) {
					updateDataContextEventHandler = function(sender, args) {
						getClickAction(d)();
					};
					this.add_click(updateDataContextEventHandler);
				}), ss.mkdel(this, function(d1) {
					this.remove_click(updateDataContextEventHandler);
				}));
			};
		},
		bindVisible: function(T) {
			return function(dataContext, getVisibleProperty) {
				var updateControlEventHandler = null;
				this.createOneWayBinding(T).call(this, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.set_visible(getVisibleProperty(d).get_value());
					});
					updateControlEventHandler = function(sender, args) {
						updateControl();
					};
					getVisibleProperty(d).add_changed(updateControlEventHandler);
					updateControl();
				}), function(d1) {
					getVisibleProperty(d1).remove_changed(updateControlEventHandler);
				});
			};
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Button.Parser
	var $MorseCode_CsJs_UI_Controls_Button$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Button]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_Button$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_Button();
		},
		parseAttribute: function(control, name, value, childControlsById) {
			if (name.toLowerCase() === 'text') {
				control.set_text(value);
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.CompositeControlBase
	var $MorseCode_CsJs_UI_Controls_CompositeControlBase = function() {
		this.$_controls = null;
		this.$_childControlsCreated = false;
		$MorseCode_CsJs_UI_Controls_ControlBase.call(this);
		this.$_controls = new $MorseCode_CsJs_UI_Controls_ControlCollection(this);
		this.$_controls.add_controlAdded(ss.mkdel(this, function(sender, args) {
			this.$changeControl(args.get_control(), true);
		}));
		this.$_controls.add_controlRemoved(ss.mkdel(this, function(sender1, args1) {
			this.$changeControl(args1.get_control(), false);
		}));
		this.$_controls.add_controlsReset(ss.mkdel(this, function(sender2, args2) {
			Enumerable.from(args2.get_oldControls()).forEach(ss.mkdel(this, function(c) {
				this.$changeControl(c, false);
			}));
			Enumerable.from(args2.get_newControls()).forEach(ss.mkdel(this, function(c1) {
				this.$changeControl(c1, true);
			}));
		}));
	};
	$MorseCode_CsJs_UI_Controls_CompositeControlBase.prototype = {
		$changeControl: function(control, add) {
			var container = this.$getChildElementContainerInternal();
			var rootElements = control.$getRootElementsInternal();
			if (ss.isValue(rootElements)) {
				var $t1 = ss.getEnumerator(rootElements);
				try {
					while ($t1.moveNext()) {
						var element = $t1.current();
						if (add) {
							container.appendChild(element);
						}
						else {
							container.removeChild(element);
						}
					}
				}
				finally {
					$t1.dispose();
				}
			}
		},
		get_controls: function() {
			return this.$_controls;
		},
		$getRootElementsInternal: function() {
			this.ensureChildControlsCreated();
			return $MorseCode_CsJs_UI_Controls_ControlBase.prototype.$getRootElementsInternal.call(this);
		},
		ensureChildControlsCreated: function() {
			this.ensureElementsCreated();
			if (!this.$_childControlsCreated) {
				this.createChildControls();
				this.$_childControlsCreated = true;
			}
		},
		createChildControls: null,
		$getChildElementContainerInternal: function() {
			this.ensureElementsCreated();
			return this.getChildElementContainer();
		},
		getChildElementContainer: null,
		onDispose: function() {
			$MorseCode_CsJs_UI_Controls_ControlBase.prototype.onDispose.call(this);
			var controls = Enumerable.from(this.get_controls()).toArray();
			this.get_controls().clear();
			for (var $t1 = 0; $t1 < controls.length; $t1++) {
				var control = controls[$t1];
				control.dispose();
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlAddedEventArgs
	var $MorseCode_CsJs_UI_Controls_ControlAddedEventArgs = function(control) {
		this.$_control = null;
		ss.EventArgs.call(this);
		this.$_control = control;
	};
	$MorseCode_CsJs_UI_Controls_ControlAddedEventArgs.prototype = {
		get_control: function() {
			return this.$_control;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlBase
	var $MorseCode_CsJs_UI_Controls_ControlBase = function() {
		this.$_bindings = [];
		this.$_elementsCreated = false;
		this.$1$ParentField = null;
	};
	$MorseCode_CsJs_UI_Controls_ControlBase.prototype = {
		get_parent: function() {
			return this.$1$ParentField;
		},
		set_parent: function(value) {
			this.$1$ParentField = value;
		},
		ensureElementsCreated: function() {
			if (!this.$_elementsCreated) {
				this.createElements();
				this.$_elementsCreated = true;
			}
		},
		createElements: null,
		$getRootElementsInternal: function() {
			this.ensureElementsCreated();
			return this.getRootElements();
		},
		getRootElements: null,
		createOneWayBinding: function(T) {
			return function(dataContext, bindToDataContext, unbindFromDataContext) {
				ss.add(this.$_bindings, new (ss.makeGenericType($MorseCode_CsJs_UI_Binding$1, [T]))(dataContext, bindToDataContext, unbindFromDataContext, function(d) {
				}, function(d1) {
				}));
			};
		},
		createOneWayToSourceBinding: function(T) {
			return function(dataContext, bindToControl, unbindFromControl) {
				ss.add(this.$_bindings, new (ss.makeGenericType($MorseCode_CsJs_UI_Binding$1, [T]))(dataContext, function(d) {
				}, function(d1) {
				}, bindToControl, unbindFromControl));
			};
		},
		createTwoWayBinding: function(T) {
			return function(dataContext, bindToDataContext, unbindFromDataContext, bindToControl, unbindFromControl) {
				ss.add(this.$_bindings, new (ss.makeGenericType($MorseCode_CsJs_UI_Binding$1, [T]))(dataContext, bindToDataContext, unbindFromDataContext, bindToControl, unbindFromControl));
			};
		},
		addBinding: function(binding) {
			ss.add(this.$_bindings, binding);
		},
		dispose: function() {
			this.$_bindings.forEach(function(b) {
				b.dispose();
			});
			ss.clear(this.$_bindings);
			this.onDispose();
		},
		onDispose: function() {
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlCollection
	var $MorseCode_CsJs_UI_Controls_ControlCollection = function(owner) {
		this.$_owner = null;
		this.$2$ControlAddedField = null;
		this.$2$ControlRemovedField = null;
		this.$2$ControlsResetField = null;
		ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_ControlBase]).call(this);
		this.$_owner = owner;
	};
	$MorseCode_CsJs_UI_Controls_ControlCollection.prototype = {
		onItemAdded: function(item) {
			ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_ControlBase]).prototype.onItemAdded.call(this, item);
			item.set_parent(this.$_owner);
			this.onControlAdded(new $MorseCode_CsJs_UI_Controls_ControlAddedEventArgs(item));
		},
		onControlAdded: function(e) {
			if (!ss.staticEquals(this.$2$ControlAddedField, null)) {
				this.$2$ControlAddedField(this, e);
			}
		},
		add_controlAdded: function(value) {
			this.$2$ControlAddedField = ss.delegateCombine(this.$2$ControlAddedField, value);
		},
		remove_controlAdded: function(value) {
			this.$2$ControlAddedField = ss.delegateRemove(this.$2$ControlAddedField, value);
		},
		onItemRemoved: function(item) {
			ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_ControlBase]).prototype.onItemRemoved.call(this, item);
			item.set_parent(null);
			this.onControlRemoved(new $MorseCode_CsJs_UI_Controls_ControlRemovedEventArgs(item));
		},
		onControlRemoved: function(e) {
			if (!ss.staticEquals(this.$2$ControlRemovedField, null)) {
				this.$2$ControlRemovedField(this, e);
			}
		},
		add_controlRemoved: function(value) {
			this.$2$ControlRemovedField = ss.delegateCombine(this.$2$ControlRemovedField, value);
		},
		remove_controlRemoved: function(value) {
			this.$2$ControlRemovedField = ss.delegateRemove(this.$2$ControlRemovedField, value);
		},
		onItemsReset: function(oldItems, newItems) {
			ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_ControlBase]).prototype.onItemsReset.call(this, oldItems, newItems);
			Enumerable.from(oldItems).forEach(function(i) {
				i.set_parent(null);
			});
			Enumerable.from(newItems).forEach(ss.mkdel(this, function(i1) {
				i1.set_parent(this.$_owner);
			}));
			this.onControlsReset(new $MorseCode_CsJs_UI_Controls_ControlsResetEventArgs(oldItems, newItems));
		},
		onControlsReset: function(e) {
			if (!ss.staticEquals(this.$2$ControlsResetField, null)) {
				this.$2$ControlsResetField(this, e);
			}
		},
		add_controlsReset: function(value) {
			this.$2$ControlsResetField = ss.delegateCombine(this.$2$ControlsResetField, value);
		},
		remove_controlsReset: function(value) {
			this.$2$ControlsResetField = ss.delegateRemove(this.$2$ControlsResetField, value);
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlParserAttribute
	var $MorseCode_CsJs_UI_Controls_ControlParserAttribute = function(controlParserType) {
		this.$_controlParserType = null;
		this.$_controlParserType = controlParserType;
	};
	$MorseCode_CsJs_UI_Controls_ControlParserAttribute.prototype = {
		get_controlParserType: function() {
			return this.$_controlParserType;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlParserBase
	var $MorseCode_CsJs_UI_Controls_ControlParserBase$1 = function(T) {
		var $type = function() {
		};
		$type.prototype = {
			parseNode: function(node, childControlsById) {
				var control = this.createControl(node, childControlsById);
				for (var i = 0; i < node.attributes.length; i++) {
					var attr = node.attributes[i];
					this.parseAttribute(control, attr.nodeName, attr.nodeValue, childControlsById);
				}
				return control;
			},
			createControl: null,
			parseAttribute: null
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_Controls_ControlParserBase$1, [T], function() {
			return null;
		}, function() {
			return [$MorseCode_CsJs_UI_Controls_IControlParser];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.Controls.ControlParserBase$1', $MorseCode_CsJs_UI_Controls_ControlParserBase$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlRemovedEventArgs
	var $MorseCode_CsJs_UI_Controls_ControlRemovedEventArgs = function(control) {
		this.$_control = null;
		ss.EventArgs.call(this);
		this.$_control = control;
	};
	$MorseCode_CsJs_UI_Controls_ControlRemovedEventArgs.prototype = {
		get_control: function() {
			return this.$_control;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ControlsResetEventArgs
	var $MorseCode_CsJs_UI_Controls_ControlsResetEventArgs = function(oldControls, newControls) {
		this.$_oldControls = null;
		this.$_newControls = null;
		ss.EventArgs.call(this);
		this.$_oldControls = oldControls;
		this.$_newControls = newControls;
	};
	$MorseCode_CsJs_UI_Controls_ControlsResetEventArgs.prototype = {
		get_oldControls: function() {
			return this.$_oldControls;
		},
		get_newControls: function() {
			return this.$_newControls;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.DropDown
	var $MorseCode_CsJs_UI_Controls_DropDown = function() {
		this.$_items = null;
		this.$_select = null;
		this.$2$SelectedIndexChangedField = null;
		$MorseCode_CsJs_UI_Controls_ControlBase.call(this);
		this.$_items = new (ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_DropDownItem]))();
		this.$_items.add_changed(ss.mkdel(this, function(sender, args) {
			this.$onItemsChanged();
		}));
	};
	$MorseCode_CsJs_UI_Controls_DropDown.prototype = {
		createElements: function() {
			this.$_select = document.createElement('select');
			$(this.$_select).change(ss.mkdel(this, function(e) {
				this.onSelectedIndexChanged();
			}));
		},
		getRootElements: function() {
			return [this.$_select];
		},
		get_items: function() {
			return this.$_items;
		},
		$onItemsChanged: function() {
			this.ensureElementsCreated();
			while (this.$_select.options.length > 0) {
				this.$_select.remove(0);
			}
			var $t1 = this.$_items.getEnumerator();
			try {
				while ($t1.moveNext()) {
					var item = $t1.current();
					var option = document.createElement('option');
					option.text = item.get_text();
					option.value = item.get_value();
					this.$_select.add(option);
				}
			}
			finally {
				$t1.dispose();
			}
		},
		get_selectedIndex: function() {
			this.ensureElementsCreated();
			return this.$_select.selectedIndex;
		},
		set_selectedIndex: function(value) {
			this.ensureElementsCreated();
			if (this.$_select.selectedIndex !== value) {
				this.$_select.selectedIndex = value;
				this.onSelectedIndexChanged();
			}
		},
		add_selectedIndexChanged: function(value) {
			this.$2$SelectedIndexChangedField = ss.delegateCombine(this.$2$SelectedIndexChangedField, value);
		},
		remove_selectedIndexChanged: function(value) {
			this.$2$SelectedIndexChangedField = ss.delegateRemove(this.$2$SelectedIndexChangedField, value);
		},
		onSelectedIndexChanged: function() {
			if (!ss.staticEquals(this.$2$SelectedIndexChangedField, null)) {
				this.$2$SelectedIndexChangedField(this, ss.EventArgs.Empty);
			}
		},
		bindItemsAndSelection: function(TDataContext, T) {
			return function(dataContext, getItems, getSelectedItemProperty, getValue, getText) {
				var updateControlItemsEventHandler = null;
				this.createOneWayBinding(TDataContext).call(this, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.get_items().clear();
						this.get_items().addRange(Enumerable.from(getItems(d)).select(function(i) {
							return new $MorseCode_CsJs_UI_Controls_DropDownItem(getText(i), getValue(i));
						}));
					});
					updateControlItemsEventHandler = function(sender, args) {
						updateControl();
					};
					getItems(d).add_changed(updateControlItemsEventHandler);
					updateControl();
				}), function(d1) {
					getItems(d1).remove_changed(updateControlItemsEventHandler);
				});
				var updateDataContextSelectedItemEventHandler = null;
				var updateControlSelectedItemEventHandler = null;
				this.createTwoWayBinding(TDataContext).call(this, dataContext, ss.mkdel(this, function(d2) {
					var updateControl1 = ss.mkdel(this, function() {
						var selectedItem = getSelectedItemProperty(d2).get_value$1();
						this.set_selectedIndex(((selectedItem === null) ? -1 : getItems(d2).indexOf(ss.Nullable.unbox(selectedItem))));
					});
					updateControlSelectedItemEventHandler = function(sender1, args1) {
						updateControl1();
					};
					getSelectedItemProperty(d2).add_changed(updateControlSelectedItemEventHandler);
					updateControl1();
				}), function(d3) {
					getSelectedItemProperty(d3).remove_changed(updateControlSelectedItemEventHandler);
				}, ss.mkdel(this, function(d4) {
					updateDataContextSelectedItemEventHandler = ss.mkdel(this, function(sender2, args2) {
						var items = getItems(d4);
						var selectedIndex = this.get_selectedIndex();
						if (selectedIndex >= 0 && selectedIndex < items.get_count()) {
							getSelectedItemProperty(d4).set_value$1(items.get_item(selectedIndex));
						}
						else {
							getSelectedItemProperty(d4).set_value$1(null);
						}
					});
					this.add_selectedIndexChanged(updateDataContextSelectedItemEventHandler);
				}), ss.mkdel(this, function(d5) {
					this.remove_selectedIndexChanged(updateDataContextSelectedItemEventHandler);
				}));
			};
		},
		bindItemsAndSelection$1: function(TDataContext, T) {
			return function(dataContext, getItems, getSelectedItemProperty, getValue, getText) {
				var updateItems = ss.mkdel(this, function(d) {
					this.get_items().clear();
					this.get_items().addRange(Enumerable.from(getItems(dataContext.get_value())).select(function(i) {
						return new $MorseCode_CsJs_UI_Controls_DropDownItem(getText(i), getValue(i));
					}));
				});
				var updateSelectedIndex = ss.mkdel(this, function(d1) {
					this.set_selectedIndex(getItems(dataContext.get_value()).indexOf(getSelectedItemProperty(dataContext.get_value()).get_value$1()));
				});
				getItems(dataContext.get_value()).add_changed(function(sender, args) {
					updateItems(dataContext.get_value());
				});
				getSelectedItemProperty(dataContext.get_value()).add_changed(function(sender1, args1) {
					updateSelectedIndex(dataContext.get_value());
				});
				this.add_selectedIndexChanged(ss.mkdel(this, function(sender2, args2) {
					var items = getItems(dataContext.get_value());
					var selectedIndex = this.get_selectedIndex();
					if (selectedIndex >= 0 && selectedIndex < items.get_count()) {
						getSelectedItemProperty(dataContext.get_value()).set_value$1(items.get_item(selectedIndex));
					}
					else {
						getSelectedItemProperty(dataContext.get_value()).set_value$1(null);
					}
				}));
				updateItems(dataContext.get_value());
				updateSelectedIndex(dataContext.get_value());
			};
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.DropDown.Parser
	var $MorseCode_CsJs_UI_Controls_DropDown$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_DropDown]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_DropDown$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_DropDown();
		},
		parseAttribute: function(control, name, value, childControlsById) {
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.DropDownItem
	var $MorseCode_CsJs_UI_Controls_DropDownItem = function(text, value) {
		this.$_text = null;
		this.$_value = null;
		this.$_text = text;
		this.$_value = value;
	};
	$MorseCode_CsJs_UI_Controls_DropDownItem.prototype = {
		get_text: function() {
			return this.$_text;
		},
		get_value: function() {
			return this.$_value;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.HtmlControl
	var $MorseCode_CsJs_UI_Controls_HtmlControl = function(tagName, createChildControls) {
		this.$_tagName = null;
		this.$_createChildControls = null;
		this.$_element = null;
		this.$_styles = new $MorseCode_CsJs_UI_Styles();
		$MorseCode_CsJs_UI_Controls_CompositeControlBase.call(this);
		this.$_tagName = tagName;
		this.$_createChildControls = createChildControls;
	};
	$MorseCode_CsJs_UI_Controls_HtmlControl.prototype = {
		createChildControls: function() {
			this.$_createChildControls(this.get_controls());
		},
		createElements: function() {
			this.$_element = document.createElement(this.$_tagName);
			this.$_styles.attachToElement(this.$_element);
		},
		getChildElementContainer: function() {
			return this.$_element;
		},
		getRootElements: function() {
			return [this.$_element];
		},
		get_styles: function() {
			return this.$_styles;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.HtmlControl.Parser
	var $MorseCode_CsJs_UI_Controls_HtmlControl$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_HtmlControl]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_HtmlControl$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_HtmlControl(node.nodeName, function(controls) {
				controls.addRange($MorseCode_CsJs_UI_Controls_MarkupParser.parseNodes(node.childNodes, childControlsById));
			});
		},
		parseAttribute: function(control, name, value, childControlsById) {
			if (name.toLowerCase() === 'style') {
				control.get_styles().$parseStyleString(value);
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.ICompositeControl
	var $MorseCode_CsJs_UI_Controls_ICompositeControl = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.IControl
	var $MorseCode_CsJs_UI_Controls_IControl = function() {
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.IControlParser
	var $MorseCode_CsJs_UI_Controls_IControlParser = function() {
	};
	$MorseCode_CsJs_UI_Controls_IControlParser.prototype = { parseNode: null };
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.IPage
	var $MorseCode_CsJs_UI_Controls_IPage = function() {
	};
	$MorseCode_CsJs_UI_Controls_IPage.prototype = { get_title: null };
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Label
	var $MorseCode_CsJs_UI_Controls_Label = function() {
		this.$_span = null;
		this.$_styles = new $MorseCode_CsJs_UI_Styles();
		$MorseCode_CsJs_UI_Controls_ControlBase.call(this);
	};
	$MorseCode_CsJs_UI_Controls_Label.prototype = {
		createElements: function() {
			this.$_span = document.createElement('span');
			this.$_styles.attachToElement(this.$_span);
		},
		getRootElements: function() {
			return [this.$_span];
		},
		get_text: function() {
			this.ensureElementsCreated();
			return this.$_span.innerText;
		},
		set_text: function(value) {
			this.ensureElementsCreated();
			this.$_span.innerText = value;
		},
		get_innerHtml: function() {
			this.ensureElementsCreated();
			return this.$_span.innerHTML;
		},
		set_innerHtml: function(value) {
			this.ensureElementsCreated();
			this.$_span.innerHTML = value;
		},
		bindText: function(T) {
			return function(dataContext, getTextProperty) {
				var updateControlEventHandler = null;
				this.createOneWayBinding(T).call(this, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.set_text(ss.coalesce(getTextProperty(d).get_value(), ''));
					});
					updateControlEventHandler = function(sender, args) {
						updateControl();
					};
					getTextProperty(d).add_changed(updateControlEventHandler);
					updateControl();
				}), function(d1) {
					getTextProperty(d1).remove_changed(updateControlEventHandler);
				});
			};
		},
		get_styles: function() {
			return this.$_styles;
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Label.Parser
	var $MorseCode_CsJs_UI_Controls_Label$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Label]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_Label$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_Label();
		},
		parseAttribute: function(control, name, value, childControlsById) {
			if (name.toLowerCase() === 'style') {
				control.get_styles().$parseStyleString(value);
			}
			if (name.toLowerCase() === 'text') {
				control.set_text(value);
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.MarkupControlBase
	var $MorseCode_CsJs_UI_Controls_MarkupControlBase$1 = function(T) {
		var $type = function() {
			this.$_childControlsById = null;
			ss.makeGenericType($MorseCode_CsJs_UI_Controls_PlaceHolderCompositeControlBase$1, [T]).call(this);
		};
		$type.prototype = {
			createChildControls: function() {
				this.$_childControlsById = new (ss.makeGenericType(ss.Dictionary$2, [String, $MorseCode_CsJs_UI_Controls_ControlBase]))();
				var document = $.parseXML('<root>' + this.get_markup() + '</root>');
				this.get_controls().addRange($MorseCode_CsJs_UI_Controls_MarkupParser.parseNodes(document.documentElement.childNodes, this.$_childControlsById));
				this.setupControls();
			},
			findControl: function(TControl) {
				return function(id) {
					var control = { $: null };
					if (ss.isValue(this.$_childControlsById)) {
						this.$_childControlsById.tryGetValue(id, control);
					}
					return ss.safeCast(control.$, TControl);
				};
			},
			get_markup: null,
			setupControls: null
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_Controls_MarkupControlBase$1, [T], function() {
			return ss.makeGenericType($MorseCode_CsJs_UI_Controls_PlaceHolderCompositeControlBase$1, [T]);
		}, function() {
			return [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.Controls.MarkupControlBase$1', $MorseCode_CsJs_UI_Controls_MarkupControlBase$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.MarkupParser
	var $MorseCode_CsJs_UI_Controls_MarkupParser = function() {
	};
	$MorseCode_CsJs_UI_Controls_MarkupParser.parseNodes = function(nodes, childControlsById) {
		var controls = [];
		if (ss.isValue(nodes)) {
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				if (node.nodeType !== 1) {
					continue;
				}
				var controlType;
				if (node.nodeName === 'control') {
					var typeAttribute = node.attributes.getNamedItem('type');
					controlType = ss.getType(typeAttribute.nodeValue);
					if (ss.isNullOrUndefined(controlType)) {
						throw new ss.NotSupportedException('Control with type ' + typeAttribute.nodeValue + ' not found.');
					}
				}
				else {
					controlType = $MorseCode_CsJs_UI_Controls_HtmlControl;
				}
				var controlParserAttributes = ss.getAttributes(controlType, $MorseCode_CsJs_UI_Controls_ControlParserAttribute, false);
				if (controlParserAttributes.length < 1) {
					throw new ss.NotSupportedException('Control with type ' + ss.getTypeFullName(controlType) + ' must have a ControlParser defined.');
				}
				if (controlParserAttributes.length > 1) {
					throw new ss.NotSupportedException('Control with type ' + ss.getTypeFullName(controlType) + ' must have only one ControlParser defined.');
				}
				var controlParserAttribute = ss.cast(controlParserAttributes[0], $MorseCode_CsJs_UI_Controls_ControlParserAttribute);
				var controlParser = ss.cast(ss.createInstance(controlParserAttribute.get_controlParserType()), $MorseCode_CsJs_UI_Controls_IControlParser);
				var control = controlParser.parseNode(node, childControlsById);
				ss.add(controls, control);
				if (ss.isValue(control)) {
					var idAttribute = node.attributes.getNamedItem('controlid');
					if (ss.isValue(idAttribute)) {
						childControlsById.add(idAttribute.nodeValue, control);
					}
				}
			}
		}
		return controls;
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.PageBase
	var $MorseCode_CsJs_UI_Controls_PageBase$1 = function(T) {
		var $type = function() {
			$MorseCode_CsJs_UI_Controls_CompositeControlBase.call(this);
		};
		$type.prototype = {
			get_title: null,
			getRootElements: function() {
				return [document.body];
			},
			getChildElementContainer: function() {
				return document.body;
			},
			createElements: function() {
			},
			bindDataContext: function(dataContext) {
				this.ensureChildControlsCreated();
				this.bindControls(new (ss.makeGenericType(MorseCode.CsJs.Common.Observable.ReadOnlyProperty$1, [T]))(dataContext));
			},
			bindControls: null
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_Controls_PageBase$1, [T], function() {
			return $MorseCode_CsJs_UI_Controls_CompositeControlBase;
		}, function() {
			return [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl, $MorseCode_CsJs_UI_Controls_IPage];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.Controls.PageBase$1', $MorseCode_CsJs_UI_Controls_PageBase$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Panel
	var $MorseCode_CsJs_UI_Controls_Panel = function(createChildControls) {
		this.$_createChildControls = null;
		this.$_div = null;
		this.$_divJQuery = null;
		this.$_styles = new $MorseCode_CsJs_UI_Styles();
		this.$_useSlideVisibilityTransition = false;
		$MorseCode_CsJs_UI_Controls_CompositeControlBase.call(this);
		this.$_createChildControls = createChildControls;
	};
	$MorseCode_CsJs_UI_Controls_Panel.prototype = {
		createChildControls: function() {
			this.$_createChildControls(this.get_controls());
		},
		createElements: function() {
			this.$_div = document.createElement('div');
			this.$_divJQuery = $(this.$_div);
			this.$_styles.attachToElement(this.$_div);
		},
		getChildElementContainer: function() {
			return this.$_div;
		},
		getRootElements: function() {
			return [this.$_div];
		},
		get_styles: function() {
			return this.$_styles;
		},
		get_visible: function() {
			return this.$_divJQuery.is(':visible');
		},
		set_visible: function(value) {
			if (this.$_useSlideVisibilityTransition) {
				if (value) {
					this.$_divJQuery.slideDown(200);
				}
				else {
					this.$_divJQuery.slideUp(200);
				}
			}
			else {
				this.$_div.style.display = (value ? '' : 'none');
			}
		},
		get_useSlideVisibilityTransition: function() {
			return this.$_useSlideVisibilityTransition;
		},
		set_useSlideVisibilityTransition: function(value) {
			this.$_useSlideVisibilityTransition = value;
		},
		bindVisible: function(T) {
			return function(dataContext, getVisibleProperty) {
				var updateControlEventHandler = null;
				this.createOneWayBinding(T).call(this, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.set_visible(getVisibleProperty(d).get_value());
					});
					updateControlEventHandler = function(sender, args) {
						updateControl();
					};
					getVisibleProperty(d).add_changed(updateControlEventHandler);
					updateControl();
				}), function(d1) {
					getVisibleProperty(d1).remove_changed(updateControlEventHandler);
				});
			};
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.Panel.Parser
	var $MorseCode_CsJs_UI_Controls_Panel$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Panel]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_Panel$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_Panel(function(controls) {
				controls.addRange($MorseCode_CsJs_UI_Controls_MarkupParser.parseNodes(node.childNodes, childControlsById));
			});
		},
		parseAttribute: function(control, name, value, childControlsById) {
			if (name.toLowerCase() === 'style') {
				control.get_styles().$parseStyleString(value);
			}
			else if (name.toLowerCase() === 'useslidevisibilitytransition') {
				control.set_useSlideVisibilityTransition(ss.isValue(value) && value.toLowerCase() === 'true');
			}
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.PlaceHolderCompositeControlBase
	var $MorseCode_CsJs_UI_Controls_PlaceHolderCompositeControlBase$1 = function(T) {
		var $type = function() {
			this.$_tempElement = null;
			$MorseCode_CsJs_UI_Controls_CompositeControlBase.call(this);
		};
		$type.prototype = {
			createElements: function() {
				this.$_tempElement = document.createElement('div');
			},
			getChildElementContainer: function() {
				return (ss.isNullOrUndefined(this.get_parent()) ? this.$_tempElement : this.get_parent().$getChildElementContainerInternal());
			},
			getRootElements: function() {
				return null;
			},
			bindDataContext: function(TDataContext) {
				return function(dataContext, getDataContext) {
					this.ensureChildControlsCreated();
					this.bindControls(new (ss.makeGenericType(MorseCode.CsJs.Common.Observable.ReadOnlyProperty$1, [T]))(getDataContext(dataContext.get_value())));
				};
			},
			bindDataContext$1: function(TDataContext) {
				return function(dataContext, getDataContext) {
					this.ensureChildControlsCreated();
					var thisDataContext = new (ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableProperty$1, [T]).$ctor1)(getDataContext(dataContext.get_value()).get_value());
					var updateControlEventHandler = null;
					this.createOneWayBinding(TDataContext).call(this, dataContext, function(d) {
						var updateControl = function() {
							thisDataContext.set_value$2(getDataContext(d).get_value());
						};
						updateControlEventHandler = function(sender, args) {
							updateControl();
						};
						getDataContext(d).add_changed(updateControlEventHandler);
						updateControl();
					}, function(d1) {
						getDataContext(d1).remove_changed(updateControlEventHandler);
					});
					this.bindControls(thisDataContext);
				};
			},
			bindControls: null,
			get_parent: function() {
				return $MorseCode_CsJs_UI_Controls_ControlBase.prototype.get_parent.call(this);
			},
			set_parent: function(value) {
				this.ensureChildControlsCreated();
				var oldContainer = this.$getChildElementContainerInternal();
				$MorseCode_CsJs_UI_Controls_ControlBase.prototype.set_parent.call(this, value);
				var container = this.$getChildElementContainerInternal();
				if (ss.referenceEquals(oldContainer, container)) {
					return;
				}
				var $t1 = this.get_controls().getEnumerator();
				try {
					while ($t1.moveNext()) {
						var control = $t1.current();
						var children = control.$getRootElementsInternal();
						var $t2 = ss.getEnumerator(children);
						try {
							while ($t2.moveNext()) {
								var child = $t2.current();
								container.appendChild(child);
								if (oldContainer.contains(child)) {
									oldContainer.removeChild(child);
								}
							}
						}
						finally {
							$t2.dispose();
						}
					}
				}
				finally {
					$t1.dispose();
				}
			}
		};
		ss.registerGenericClassInstance($type, $MorseCode_CsJs_UI_Controls_PlaceHolderCompositeControlBase$1, [T], function() {
			return $MorseCode_CsJs_UI_Controls_CompositeControlBase;
		}, function() {
			return [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl];
		});
		return $type;
	};
	ss.registerGenericClass(global, 'MorseCode.CsJs.UI.Controls.PlaceHolderCompositeControlBase$1', $MorseCode_CsJs_UI_Controls_PlaceHolderCompositeControlBase$1, 1);
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.TextBox
	var $MorseCode_CsJs_UI_Controls_TextBox = function() {
		this.$_input = null;
		this.$_textBoxTextBinding = null;
		this.$_updateTextBindingWhileChanging = false;
		this.$2$TextChangingField = null;
		this.$2$TextChangedField = null;
		$MorseCode_CsJs_UI_Controls_ControlBase.call(this);
	};
	$MorseCode_CsJs_UI_Controls_TextBox.prototype = {
		createElements: function() {
			this.$_input = document.createElement('input');
			this.$_input.type = 'text';
			$(this.$_input).keyup(ss.mkdel(this, function(e) {
				this.onTextChanging();
			}));
			$(this.$_input).change(ss.mkdel(this, function(e1) {
				this.onTextChanged();
			}));
		},
		getRootElements: function() {
			return [this.$_input];
		},
		get_text: function() {
			this.ensureElementsCreated();
			return this.$_input.value;
		},
		set_text: function(value) {
			this.ensureElementsCreated();
			if (!ss.referenceEquals(this.$_input.value, value)) {
				this.$_input.value = value;
				this.onTextChanging();
				this.onTextChanged();
			}
		},
		get_updateTextBindingWhileChanging: function() {
			return this.$_updateTextBindingWhileChanging;
		},
		set_updateTextBindingWhileChanging: function(value) {
			if (this.$_updateTextBindingWhileChanging !== value) {
				this.$_updateTextBindingWhileChanging = value;
				if (ss.isValue(this.$_textBoxTextBinding)) {
					this.$_textBoxTextBinding.set_$updateWhileChanging(value);
				}
			}
		},
		add_textChanging: function(value) {
			this.$2$TextChangingField = ss.delegateCombine(this.$2$TextChangingField, value);
		},
		remove_textChanging: function(value) {
			this.$2$TextChangingField = ss.delegateRemove(this.$2$TextChangingField, value);
		},
		onTextChanging: function() {
			if (!ss.staticEquals(this.$2$TextChangingField, null)) {
				this.$2$TextChangingField(this, ss.EventArgs.Empty);
			}
		},
		add_textChanged: function(value) {
			this.$2$TextChangedField = ss.delegateCombine(this.$2$TextChangedField, value);
		},
		remove_textChanged: function(value) {
			this.$2$TextChangedField = ss.delegateRemove(this.$2$TextChangedField, value);
		},
		onTextChanged: function() {
			if (!ss.staticEquals(this.$2$TextChangedField, null)) {
				this.$2$TextChangedField(this, ss.EventArgs.Empty);
			}
		},
		bindText: function(T) {
			return function(dataContext, getTextProperty) {
				this.bindText$1(T).call(this, dataContext, getTextProperty, this.get_updateTextBindingWhileChanging());
			};
		},
		bindText$1: function(T) {
			return function(dataContext, getTextProperty, updateTextBindingWhileChanging) {
				if (ss.isValue(this.$_textBoxTextBinding)) {
					throw new ss.NotSupportedException('Bind may not be called twice on TextBox.');
				}
				var updateControlEventHandler = null;
				this.$_textBoxTextBinding = new (ss.makeGenericType($MorseCode_$CsJs_UI_Controls_TextBox$TextBoxTextBinding$1, [T]))(this, getTextProperty, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.set_text(ss.coalesce(getTextProperty(d).get_value$1(), ''));
					});
					updateControlEventHandler = function(sender, args) {
						updateControl();
					};
					getTextProperty(d).add_changed(updateControlEventHandler);
					updateControl();
				}), function(d1) {
					getTextProperty(d1).remove_changed(updateControlEventHandler);
				}, updateTextBindingWhileChanging);
				this.addBinding(this.$_textBoxTextBinding);
			};
		},
		bindUpdateTextBindingWhileChanging: function(T) {
			return function(dataContext, getUpdateTextBindingWhileChangingProperty) {
				var updateControlEventHandler = null;
				this.createOneWayBinding(T).call(this, dataContext, ss.mkdel(this, function(d) {
					var updateControl = ss.mkdel(this, function() {
						this.set_updateTextBindingWhileChanging(getUpdateTextBindingWhileChangingProperty(d).get_value());
					});
					updateControlEventHandler = function(sender, args) {
						updateControl();
					};
					getUpdateTextBindingWhileChangingProperty(d).add_changed(updateControlEventHandler);
					updateControl();
				}), function(d1) {
					getUpdateTextBindingWhileChangingProperty(d1).remove_changed(updateControlEventHandler);
				});
			};
		}
	};
	////////////////////////////////////////////////////////////////////////////////
	// MorseCode.CsJs.UI.Controls.TextBox.Parser
	var $MorseCode_CsJs_UI_Controls_TextBox$Parser = function() {
		ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_TextBox]).call(this);
	};
	$MorseCode_CsJs_UI_Controls_TextBox$Parser.prototype = {
		createControl: function(node, childControlsById) {
			return new $MorseCode_CsJs_UI_Controls_TextBox();
		},
		parseAttribute: function(control, name, value, childControlsById) {
		}
	};
	ss.registerClass(null, 'MorseCode.$CsJs.UI.ApplicationBase$ApplicationPage', $MorseCode_$CsJs_UI_ApplicationBase$ApplicationPage);
	ss.registerInterface(global, 'MorseCode.CsJs.UI.IBinding', $MorseCode_CsJs_UI_IBinding, [ss.IDisposable]);
	ss.registerInterface(null, 'MorseCode.$CsJs.UI.Controls.TextBox$ITextBoxTextBinding', $MorseCode_$CsJs_UI_Controls_TextBox$ITextBoxTextBinding, [ss.IDisposable, $MorseCode_CsJs_UI_IBinding]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.ApplicationBase', $MorseCode_CsJs_UI_ApplicationBase);
	ss.registerClass(global, 'MorseCode.CsJs.UI.ApplicationBase$PageRegistrationHelper', $MorseCode_CsJs_UI_ApplicationBase$PageRegistrationHelper);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Styles', $MorseCode_CsJs_UI_Styles, null, [ss.IEnumerable, ss.IEnumerable]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.WindowTimer', $MorseCode_CsJs_UI_WindowTimer, null, [MorseCode.CsJs.Common.ITimer]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.WindowTimerFactory', $MorseCode_CsJs_UI_WindowTimerFactory, null, [MorseCode.CsJs.Common.ITimerFactory]);
	ss.registerInterface(global, 'MorseCode.CsJs.UI.Controls.IControl', $MorseCode_CsJs_UI_Controls_IControl, [ss.IDisposable]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlBase', $MorseCode_CsJs_UI_Controls_ControlBase, null, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Button', $MorseCode_CsJs_UI_Controls_Button, $MorseCode_CsJs_UI_Controls_ControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_Button$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Button$Parser', $MorseCode_CsJs_UI_Controls_Button$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Button]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	ss.registerInterface(global, 'MorseCode.CsJs.UI.Controls.ICompositeControl', $MorseCode_CsJs_UI_Controls_ICompositeControl, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.CompositeControlBase', $MorseCode_CsJs_UI_Controls_CompositeControlBase, $MorseCode_CsJs_UI_Controls_ControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlAddedEventArgs', $MorseCode_CsJs_UI_Controls_ControlAddedEventArgs, ss.EventArgs);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlCollection', $MorseCode_CsJs_UI_Controls_ControlCollection, ss.makeGenericType(MorseCode.CsJs.Common.Observable.ObservableCollection$1, [$MorseCode_CsJs_UI_Controls_ControlBase]), [ss.IEnumerable, ss.IEnumerable, ss.ICollection, ss.IList, MorseCode.CsJs.Common.Observable.IObservable]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlParserAttribute', $MorseCode_CsJs_UI_Controls_ControlParserAttribute);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlRemovedEventArgs', $MorseCode_CsJs_UI_Controls_ControlRemovedEventArgs, ss.EventArgs);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.ControlsResetEventArgs', $MorseCode_CsJs_UI_Controls_ControlsResetEventArgs, ss.EventArgs);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.DropDown', $MorseCode_CsJs_UI_Controls_DropDown, $MorseCode_CsJs_UI_Controls_ControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_DropDown$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.DropDown$Parser', $MorseCode_CsJs_UI_Controls_DropDown$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_DropDown]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.DropDownItem', $MorseCode_CsJs_UI_Controls_DropDownItem);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.HtmlControl', $MorseCode_CsJs_UI_Controls_HtmlControl, $MorseCode_CsJs_UI_Controls_CompositeControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_HtmlControl$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.HtmlControl$Parser', $MorseCode_CsJs_UI_Controls_HtmlControl$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_HtmlControl]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	ss.registerInterface(global, 'MorseCode.CsJs.UI.Controls.IControlParser', $MorseCode_CsJs_UI_Controls_IControlParser);
	ss.registerInterface(global, 'MorseCode.CsJs.UI.Controls.IPage', $MorseCode_CsJs_UI_Controls_IPage, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Label', $MorseCode_CsJs_UI_Controls_Label, $MorseCode_CsJs_UI_Controls_ControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_Label$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Label$Parser', $MorseCode_CsJs_UI_Controls_Label$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Label]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.MarkupParser', $MorseCode_CsJs_UI_Controls_MarkupParser);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Panel', $MorseCode_CsJs_UI_Controls_Panel, $MorseCode_CsJs_UI_Controls_CompositeControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl, $MorseCode_CsJs_UI_Controls_ICompositeControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_Panel$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.Panel$Parser', $MorseCode_CsJs_UI_Controls_Panel$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_Panel]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.TextBox', $MorseCode_CsJs_UI_Controls_TextBox, $MorseCode_CsJs_UI_Controls_ControlBase, [ss.IDisposable, $MorseCode_CsJs_UI_Controls_IControl], { attr: [new $MorseCode_CsJs_UI_Controls_ControlParserAttribute($MorseCode_CsJs_UI_Controls_TextBox$Parser)] });
	ss.registerClass(global, 'MorseCode.CsJs.UI.Controls.TextBox$Parser', $MorseCode_CsJs_UI_Controls_TextBox$Parser, ss.makeGenericType($MorseCode_CsJs_UI_Controls_ControlParserBase$1, [$MorseCode_CsJs_UI_Controls_TextBox]), [$MorseCode_CsJs_UI_Controls_IControlParser]);
	$MorseCode_CsJs_UI_WindowTimerFactory.$instanceLazy = null;
	$MorseCode_CsJs_UI_WindowTimerFactory.$instanceLazy = new ss.Lazy(function() {
		return new $MorseCode_CsJs_UI_WindowTimerFactory();
	});
})();