﻿using MorseCode.CsJs.Common;
using MorseCode.CsJs.Common.Observable;
using MorseCode.CsJs.Examples.CalculatorsAndStopwatch.ViewModel;

namespace MorseCode.CsJs.Examples.CalculatorsAndStopwatch.UI
{
	public class CalculatorControl : CalculatorControlBase<ICalculatorViewModel>
	{
		protected override void SetupControls()
		{
			_equals.SetText("=");
			_largeResultPanel.Styles.AddOrSet("margin", "50px");
			_largeResultPanel.Styles.AddOrSet("padding", "50px");
			_largeResultLabel.Styles.AddOrSet("font-size", "72pt");
		}

		protected override void BindControls(IReadableObservableProperty<ICalculatorViewModel> dataContext)
		{
			_updateInRealTime.BindItemsAndSelection(dataContext, d => d.UpdateInRealTimeItems, d => d.UpdateInRealTimeSelection, o => o ? "Yes" : "No", o => o ? "Yes" : "No");
			_simulateLatencyPanel.BindVisible(dataContext, d => d.SupportsAsync);
			_simulateLatencyPanel.UseSlideVisibilityTransition = true;
			_simulateLatency.BindItemsAndSelection(dataContext, d => d.SimulateLatencyItems, d => d.SimulateLatencySelection, o => o ? "Yes" : "No", o => o ? "Yes" : "No");
			_useResultDelay.BindChecked(dataContext, d => d.UseResultDelay);
			_numberOfWebServiceRequestsSent.BindText(dataContext, d => d.NumberOfWebServiceRequestsSent, o => o.ToString());
			_function.BindItemsAndSelection(dataContext, d => d.Operators, d => d.SelectedOperator, o => o.EnumToString(), o => o.EnumToString());
			_operand1.BindUpdateTextBindingWhileChanging(dataContext, d => d.UpdateInRealTime);
			_operand1.BindText(dataContext, d => d.Operand1, true);
			_operator.BindText(dataContext, d => d.SelectedOperatorString);
			_operand2.BindUpdateTextBindingWhileChanging(dataContext, d => d.UpdateInRealTime);
			_operand2.BindText(dataContext, d => d.Operand2, true);
			_result.BindText(dataContext, d => d.Result);
			_largeResultLabel.BindText(dataContext, d => d.Result);
		}
	}
}